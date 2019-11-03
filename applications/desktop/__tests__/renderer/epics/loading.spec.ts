import { monocellNotebook, toJS } from "@nteract/commutable";
import { actions } from "@nteract/core";
import { fixtureCommutable } from "@nteract/fixtures";
import { ActionsObservable } from "redux-observable";
import { toArray } from "rxjs/operators";

import {
  extractNewKernel,
  fetchContentEpic,
  newNotebookEpic
} from "../../../src/notebook/epics/loading";

const path = require("path");

describe("extractNewKernel", () => {
  test("extracts and launches the kernel from a notebook", () => {
    expect(extractNewKernel("/tmp/test.ipynb", fixtureCommutable)).toEqual({
      kernelSpecName: "python3",
      cwd: path.resolve("/tmp")
    });
  });
});

describe("loadingEpic", () => {
  test("errors without a filename", done => {
    const action$ = ActionsObservable.of({
      type: "CORE/FETCH_CONTENT",
      payload: {}
    });
    const responseActions = fetchContentEpic(action$);
    responseActions.subscribe(
      _ => _,
      err => {
        expect(err.message).toBe("fetch content needs a path");
        done();
      },
      () => {
        done.fail();
      }
    );
  });
  test("errors when file cant be read", async () => {
    const action$ = ActionsObservable.of({
      type: "CORE/FETCH_CONTENT",
      payload: { filepath: "file" }
    });

    const responseActions = await fetchContentEpic(action$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        payload: {
          error: expect.anything(),
          filepath: "file"
        },
        error: true,
        type: "CORE/FETCH_CONTENT_FAILED"
      }
    ]);
  });
});

describe("newNotebookEpic", () => {
  test("calls new Kernel after creating a new notebook", async () => {
    const action$ = ActionsObservable.of({
      type: actions.NEW_NOTEBOOK,
      payload: {
        filepath: null,
        cwd: "/home/whatever",
        kernelSpec: {
          name: "hylang"
        },
        kernelRef: "kRef",
        contentRef: "cRef"
      }
    });
    const responseActions = await newNotebookEpic(action$)
      .pipe(toArray())
      .toPromise();
    const filepath = process.platform === "win32"
      ? "\\home\\whatever\\Untitled.ipynb"
      : "/home/whatever/Untitled.ipynb";

    expect(responseActions).toEqual([
      {
        type: actions.FETCH_CONTENT_FULFILLED,
        payload: {
          contentRef: "cRef",
          kernelRef: "kRef",
          filepath,
          model: {
            type: "notebook",
            mimetype: "application/x-ipynb+json",
            format: "json",
            content: toJS(
              monocellNotebook
                .setIn(["metadata", "kernel_info", "name"], "hylang")
                .setIn(["metadata", "language_info", "name"], "hylang")
            ),
            writable: true,
            name: "Untitled.ipynb",
            path: filepath,
            created: expect.any(String),
            last_modified: expect.any(String)
          }
        }
      }
    ]);
  });
});

describe("newNotebookEpicNamed", () => {
  test(
    "calls new Kernel after creating a new notebook with given name",
      async () => {
      const action$ = ActionsObservable.of({
        type: actions.NEW_NOTEBOOK,
        payload: {
          filepath: "/home/whatever2/some.ipynb",
          cwd: "/home/whatever",
          kernelSpec: {
            name: "hylang"
          },
          kernelRef: "kRef",
          contentRef: "cRef"
        }
      });
      const responseActions = await newNotebookEpic(action$)
        .pipe(toArray())
        .toPromise();
      const filepath = process.platform === "win32"
        ? "\\home\\whatever2\\some.ipynb"
        : "/home/whatever2/some.ipynb";
  
      expect(responseActions).toEqual([
        {
          type: actions.FETCH_CONTENT_FULFILLED,
          payload: {
            contentRef: "cRef",
            kernelRef: "kRef",
            filepath,
            model: {
              type: "notebook",
              mimetype: "application/x-ipynb+json",
              format: "json",
              content: toJS(
                monocellNotebook
                  .setIn(["metadata", "kernel_info", "name"], "hylang")
                  .setIn(["metadata", "language_info", "name"], "hylang")
              ),
              writable: true,
              name: "some.ipynb",
              path: filepath,
              created: expect.any(String),
              last_modified: expect.any(String)
            }
          }
        }
      ]);
    });
});
