import FileSaver from "file-saver";
import Immutable from "immutable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { of, Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import { stringifyNotebook } from "@nteract/commutable";
import {
  actions,
  ContentRecord,
  createContentRef,
  createKernelspecsRef,
  makeAppRecord,
  makeCommsRecord,
  makeContentsRecord,
  makeDummyContentRecord,
  makeEntitiesRecord,
  makeHostsRecord,
  makeJupyterHostRecord,
  makeNotebookContentRecord,
  makeStateRecord,
  makeTransformsRecord
} from "@nteract/core";

import { fixtureJSON } from "@nteract/fixtures";
import { downloadString, saveAsContentEpic } from "../src/contents";

jest.mock("rx-jupyter", () => ({
  contents: {
    save: (severConfig, filepath, model) => {
      return of({ response: {} });
    }
  }
}));

describe("downloadString", () => {
  it("calls FileSaver.saveAs with notebook and filename", () => {
    const filename = "/here/there/awesome.ipynb";
    const expectedData = fixtureJSON;
    expect(FileSaver.saveAs).not.toHaveBeenCalled();
    downloadString(
      stringifyNotebook(fixtureJSON),
      filename,
      "application/json"
    );
    expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
    const actualMockBlobResponse = (FileSaver.saveAs as any).mock.calls[0][0];
    const actualFilename = (FileSaver.saveAs as any).mock.calls[0][1];

    expect(actualMockBlobResponse).toEqual({
      content: [stringifyNotebook(expectedData)],
      options: { type: "application/json" }
    });

    expect(actualFilename).toBe("awesome.ipynb");
  });
});

describe("saveAs", () => {
  const contentRef = createContentRef();
  const kernelspecsRef = createKernelspecsRef();
  it("does not save if no host is set", async () => {
    const state = {
      app: makeAppRecord({
        version: "test"
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeDummyContentRecord({
                filepath: "test.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFailed({
        contentRef,
        error: new Error("Cannot save content if no host is set.")
      })
    ]);
  });
  it("does not save if there is no content", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({}),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFailed({
        contentRef,
        error: new Error("Content was not set.")
      })
    ]);
  });
  it("saves notebook files", async () => {
    const state = {
      app: makeAppRecord({
        version: "test",
        host: makeJupyterHostRecord({})
      }),
      comms: makeCommsRecord(),
      config: Immutable.Map({
        theme: "light"
      }),
      core: makeStateRecord({
        currentKernelspecsRef: kernelspecsRef,
        entities: makeEntitiesRecord({
          hosts: makeHostsRecord({}),
          contents: makeContentsRecord({
            byRef: Immutable.Map<string, ContentRecord>().set(
              contentRef,
              makeNotebookContentRecord({
                filepath: "a-different-filename.ipynb"
              })
            )
          }),
          transforms: makeTransformsRecord({
            displayOrder: Immutable.List([]),
            byId: Immutable.Map({})
          })
        })
      })
    };

    const responses = await saveAsContentEpic(
      ActionsObservable.of(
        actions.saveAs({ filepath: "test.ipynb", contentRef })
      ),
      new StateObservable(new Subject(), state)
    )
      .pipe(toArray())
      .toPromise();

    expect(responses).toEqual([
      actions.saveAsFulfilled({
        contentRef,
        model: {}
      })
    ]);
  });
});
