import { state as stateModule } from "@nteract/core";
import { remote } from "electron";
import Immutable from "immutable";
import { of } from "rxjs";

import * as nativeWindow from "../../src/notebook/native-window";

const path = require("path");

describe("tildify", () => {
  test("returns an empty string if given no path", () => {
    expect(nativeWindow.tildify()).toBe("");
  });
  test("replaces the user directory with ~", () => {
    const fixture = path.join(remote.app.getPath("home"), "test-notebooks");
    const result = nativeWindow.tildify(fixture);
    if (process.platform === "win32") {
      expect(result).toBe(fixture);
    } else {
      expect(result).toContain("~");
    }
  });
});

describe("setTitleFromAttributes", () => {
  test("sets the window title", () => {
    // Set up our "Electron window"
    const win = {
      setRepresentedFilename: jest.fn(),
      setDocumentEdited: jest.fn(),
      setTitle: jest.fn()
    };

    remote.getCurrentWindow = jest.fn();
    remote.getCurrentWindow.mockReturnValue(win);

    const titleObject = {
      fullpath: "/tmp/test.ipynb",
      kernelStatus: "busy",
      modified: true
    };
    nativeWindow.setTitleFromAttributes(titleObject);

    expect(win.setTitle).toBeCalled();
  });
});

describe("createTitleFeed", () => {
  test("creates an observable that updates title attributes for modified notebook", async () => {
    const kernelRef = stateModule.createKernelRef();
    const contentRef = stateModule.createContentRef();

    const state = {
      core: stateModule.makeStateRecord({
        kernelRef,
        entities: stateModule.makeEntitiesRecord({
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              [contentRef]: stateModule.makeNotebookContentRecord({
                filepath: "titled.ipynb"
              })
            })
          }),
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              [kernelRef]: stateModule.makeRemoteKernelRecord({
                status: "not connected"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord()
    };

    const state$ = of(state);

    const attributes = await nativeWindow
      .createTitleFeed(contentRef, state$)
      .toPromise();
    expect(attributes).toEqual({
      modified: false,
      fullpath: "titled.ipynb",
      kernelStatus: "not connected"
    });
  });
});
