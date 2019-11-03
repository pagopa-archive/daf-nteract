import { stringifyNotebook, toJS } from "@nteract/commutable";
import { Notebook } from "@nteract/commutable";
import FileSaver from "file-saver";
import { Action } from "redux";
import { ofType } from "redux-observable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { contents } from "rx-jupyter";
import { empty, from, interval, Observable, of } from "rxjs";
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  map,
  mergeMap,
  pluck,
  switchMap,
  tap
} from "rxjs/operators";

import * as actions from "@nteract/actions";
import * as selectors from "@nteract/selectors";
import {
  AppState,
  ContentRef,
  DirectoryContentRecordProps,
  DummyContentRecordProps,
  FileContentRecordProps,
  NotebookContentRecordProps,
  ServerConfig
} from "@nteract/types";
import { AjaxResponse } from "rxjs/ajax";

import urljoin from "url-join";

import { RecordOf } from "immutable";
import { existsSync } from "fs";

export function updateContentEpic(
  action$: ActionsObservable<actions.ChangeContentName>,
  state$: StateObservable<AppState>
): Observable<{}> {
  return action$.pipe(
    ofType(actions.CHANGE_CONTENT_NAME),
    switchMap(action => {
      if (!action.payload || typeof action.payload.filepath !== "string") {
        return of({
          type: "ERROR",
          error: true,
          payload: { error: new Error("updating content needs a payload") }
        }) as any;
      }

      const state: any = state$.value;
      const host: any = selectors.currentHost(state);

      // Dismiss any usage that isn't targeting a jupyter server
      if (host.type !== "jupyter") {
        return empty();
      }

      const { contentRef, filepath, prevFilePath } = action.payload;
      const serverConfig: ServerConfig = selectors.serverConfig(host);

      return contents
        .update(serverConfig, prevFilePath, { path: filepath.slice(1) })
        .pipe(
          tap(xhr => {
            if (xhr.status !== 200) {
              throw new Error(xhr.response);
            }
          }),
          map(() => {
            /*
             * Modifying the url's file name in the browser.
             * This effects back button behavior.
             * Is there a better way to accomplish this?
             */
            window.history.replaceState(
              {},
              filepath,
              urljoin(host.basePath, `/nteract/edit${filepath}`)
            );

            return actions.changeContentNameFulfilled({
              contentRef: action.payload.contentRef,
              filepath: action.payload.filepath,
              prevFilePath
            });
          }),
          catchError((xhrError: any) =>
            of(
              actions.changeContentNameFailed({
                basepath: host.basepath,
                filepath: action.payload.filepath,
                prevFilePath,
                error: xhrError,
                contentRef: action.payload.contentRef
              })
            )
          )
        );
    })
  );
}

export function fetchContentEpic(
  action$: ActionsObservable<
    | actions.FetchContent
    | actions.FetchContentFailed
    | actions.FetchContentFulfilled
  >,
  state$: StateObservable<AppState>
): Observable<{}> {
  return action$.pipe(
    ofType(actions.FETCH_CONTENT),
    switchMap(action => {
      if (!action.payload || typeof action.payload.filepath !== "string") {
        return of({
          type: "ERROR",
          error: true,
          payload: { error: new Error("fetching content needs a payload") }
        }) as any;
      }

      const state: any = state$.value;
      const host: any = selectors.currentHost(state);

      // Dismiss any usage that isn't targeting a jupyter server
      if (host.type !== "jupyter") {
        return empty();
      }

      const serverConfig: ServerConfig = selectors.serverConfig(host);

      return contents
        .get(
          serverConfig,
          (action as actions.FetchContent).payload.filepath,
          (action as actions.FetchContent).payload.params
        )
        .pipe(
          tap(xhr => {
            if (xhr.status !== 200) {
              throw new Error(xhr.response.toString());
            }
          }),
          map(xhr => {
            if (typeof xhr.response === "string") {
              throw new Error(`Invalid API response: ${xhr.response}`);
            }

            return actions.fetchContentFulfilled({
              filepath: action.payload.filepath,
              model: xhr.response,
              kernelRef: action.payload.kernelRef,
              contentRef: action.payload.contentRef
            });
          }),
          catchError((xhrError: any) =>
            of(
              actions.fetchContentFailed({
                filepath: action.payload.filepath,
                error: xhrError,
                kernelRef: action.payload.kernelRef,
                contentRef: action.payload.contentRef
              })
            )
          )
        );
    })
  );
}

export function downloadString(
  fileContents: string,
  filepath: string,
  contentType: string
): void {
  const filename = filepath.split("/").pop();
  const blob = new Blob([fileContents], { type: contentType });
  // NOTE: There is no callback for this, we have to rely on the browser
  //       to do this well, so we assume it worked
  FileSaver.saveAs(blob, filename);
}

export function autoSaveCurrentContentEpic(
  action$: ActionsObservable<Action>,
  state$: StateObservable<AppState>
): Observable<actions.Save> {
  const state = state$.value;
  const duration = selectors.autoSaveInterval(state);
  return interval(duration).pipe(
    mergeMap(() => {
      const contentRef$ = from(
        selectors
          .contentByRef(state)
          .filter(
            /**
             * Only save contents that are files or notebooks with
             * a filepath already set.
             */
            content =>
              (content.type === "file" || content.type === "notebook") &&
              content.filepath !== "" &&
              selectors.isCurrentKernelZeroMQ(state)
                ? existsSync(content.filepath)
                : true
          )
          .keys()
      );

      return contentRef$;
    }),
    mergeMap((contentRef: ContentRef) =>
      state$.pipe(
        pluck(
          "core",
          "entities",
          "contents",
          "byRef",
          contentRef,
          "model",
          "notebook"
        ),
        distinctUntilChanged(),
        concatMap(() => of(actions.save({ contentRef })))
      )
    )
  );
}

function serializeContent(
  state: AppState,
  content:
    | RecordOf<NotebookContentRecordProps>
    | RecordOf<DummyContentRecordProps>
    | RecordOf<FileContentRecordProps>
    | RecordOf<DirectoryContentRecordProps>
) {
  // This could be object for notebook, or string for files
  let serializedData: Notebook | string;
  let saveModel: Partial<contents.IContent<"file" | "notebook">> = {};
  if (content.type === "notebook") {
    const appVersion = selectors.appVersion(state);

    // contents API takes notebook as raw JSON whereas downloading takes
    // a string
    serializedData = toJS(
      content.model.notebook.setIn(
        ["metadata", "nteract", "version"],
        appVersion
      )
    );
    saveModel = {
      content: serializedData,
      type: content.type
    };
  } else if (content.type === "file") {
    serializedData = content.model.text;
    saveModel = {
      content: serializedData,
      type: content.type,
      format: "text"
    };
  } else {
    return { saveModel: null, serializedData: null };
  }

  return { saveModel, serializedData };
}

export function saveContentEpic(
  action$: ActionsObservable<actions.Save | actions.DownloadContent>,
  state$: StateObservable<AppState>
): Observable<
  | actions.DownloadContentFailed
  | actions.DownloadContentFulfilled
  | actions.SaveFailed
  | actions.SaveFulfilled
> {
  return action$.pipe(
    ofType(actions.SAVE, actions.DOWNLOAD_CONTENT),
    mergeMap((action: actions.Save | actions.DownloadContent):
      | Observable<
          | actions.DownloadContentFailed
          | actions.DownloadContentFulfilled
          | actions.SaveFailed
          | actions.SaveFulfilled
        >
      | Observable<never> => {
      const state = state$.value;

      const host = selectors.currentHost(state);
      if (host.type !== "jupyter") {
        return of(
          actions.saveFailed({
            error: new Error("Cannot save content if no host is set."),
            contentRef: action.payload.contentRef
          })
        );
      }
      const contentRef = action.payload.contentRef;
      const content = selectors.content(state, { contentRef });

      // NOTE: This could save by having selectors for each model type
      //       have toDisk() selectors
      //       It will need to be cased off when we have more than one type
      //       of content we actually save
      if (!content) {
        const errorPayload = {
          error: new Error("Content was not set."),
          contentRef: action.payload.contentRef
        };
        if (action.type === actions.DOWNLOAD_CONTENT) {
          return of(actions.downloadContentFailed(errorPayload));
        }
        return of(actions.saveFailed(errorPayload));
      }

      if (content.type === "directory") {
        return of(
          actions.saveFailed({
            error: new Error("Cannot save directories."),
            contentRef: action.payload.contentRef
          })
        );
      }

      const filepath = content.filepath;

      const { serializedData, saveModel } = serializeContent(state, content);

      if (!saveModel || !serializedData) {
        return of(
          actions.saveFailed({
            error: new Error("No serialized model created for this content."),
            contentRef: action.payload.contentRef
          })
        );
      }

      switch (action.type) {
        case actions.DOWNLOAD_CONTENT: {
          // FIXME: Convert this to downloadString, so it works for
          // both files & notebooks
          if (
            content.type === "notebook" &&
            typeof serializedData === "object"
          ) {
            downloadString(
              stringifyNotebook(serializedData),
              filepath || "notebook.ipynb",
              "application/json"
            );
          } else if (
            content.type === "file" &&
            typeof serializedData === "string"
          ) {
            downloadString(
              serializedData,
              filepath,
              content.mimetype || "application/octet-stream"
            );
          } else {
            // This shouldn't happen, is here for safety
            return empty();
          }
          return of(
            actions.downloadContentFulfilled({
              contentRef: action.payload.contentRef
            })
          );
        }
        case actions.SAVE: {
          const serverConfig: ServerConfig = selectors.serverConfig(host);

          // Check to see if the file was modified since the last time
          // we saved.
          return contents.get(serverConfig, filepath, { content: 0 }).pipe(
            // Make sure that the modified time is within some delta
            mergeMap(xhr => {
              if (xhr.status !== 200) {
                throw new Error(xhr.response.toString());
              }
              if (typeof xhr.response === "string") {
                throw new Error(
                  `jupyter server response invalid: ${xhr.response}`
                );
              }

              const model = xhr.response;

              const diskDate = new Date(model.last_modified);
              const inMemoryDate = content.lastSaved
                ? new Date(content.lastSaved)
                : // FIXME: I'm unsure if we don't have a date if we should
                  // default to the disk date
                  diskDate;
              const diffDate = diskDate.getTime() - inMemoryDate.getTime();

              if (Math.abs(diffDate) > 600) {
                return of(
                  actions.saveFailed({
                    error: new Error("open in another tab possibly..."),
                    contentRef: action.payload.contentRef
                  })
                );
              }

              return contents.save(serverConfig, filepath, saveModel).pipe(
                map((xhr: AjaxResponse) => {
                  return actions.saveFulfilled({
                    contentRef: action.payload.contentRef,
                    model: xhr.response
                  });
                }),
                catchError((error: Error) =>
                  of(
                    actions.saveFailed({
                      error,
                      contentRef: action.payload.contentRef
                    })
                  )
                )
              );
            })
          );
        }
        default:
          // NOTE: Our ofType should prevent reaching here, this
          // is here merely as safety
          return empty();
      }
    })
  );
}

export function saveAsContentEpic(
  action$: ActionsObservable<actions.SaveAs>,
  state$: StateObservable<AppState>
): Observable<actions.SaveAsFailed | actions.SaveAsFulfilled> {
  return action$.pipe(
    ofType(actions.SAVE_AS),
    mergeMap((action: actions.SaveAs):
      | Observable<actions.SaveAsFailed | actions.SaveAsFulfilled>
      | Observable<never> => {
      const state = state$.value;

      const host = selectors.currentHost(state);
      if (host.type !== "jupyter") {
        return of(
          actions.saveAsFailed({
            error: new Error("Cannot save content if no host is set."),
            contentRef: action.payload.contentRef
          })
        );
      }
      const contentRef = action.payload.contentRef;
      const content = selectors.content(state, { contentRef });

      if (!content) {
        const errorPayload = {
          error: new Error("Content was not set."),
          contentRef: action.payload.contentRef
        };
        return of(actions.saveAsFailed(errorPayload));
      }

      if (content.type === "directory") {
        return of(
          actions.saveAsFailed({
            error: new Error("Cannot save directories."),
            contentRef: action.payload.contentRef
          })
        );
      }

      const filepath = action.payload.filepath;

      const { saveModel } = serializeContent(state, content);

      if (!saveModel) {
        return of(
          actions.saveAsFailed({
            error: new Error("No serialized model created for this content."),
            contentRef: action.payload.contentRef
          })
        );
      }

      const serverConfig: ServerConfig = selectors.serverConfig(host);

      return contents.save(serverConfig, filepath, saveModel).pipe(
        map((xhr: AjaxResponse) => {
          return actions.saveAsFulfilled({
            contentRef: action.payload.contentRef,
            model: xhr.response
          });
        }),
        catchError((error: Error) =>
          of(
            actions.saveAsFailed({
              error,
              contentRef: action.payload.contentRef
            })
          )
        )
      );
    })
  );
}
