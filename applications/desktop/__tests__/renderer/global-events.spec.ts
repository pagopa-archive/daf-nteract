import {
  createContentRef,
  makeContentsRecord,
  makeDocumentRecord,
  makeEntitiesRecord,
  makeNotebookContentRecord,
  makeStateRecord
} from "@nteract/core";
import * as Immutable from "immutable";

import { ipcRenderer as ipc } from "../../__mocks__/electron";
import * as actions from "../../src/notebook/actions";
import * as globalEvents from "../../src/notebook/global-events";
import {
  DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED,
  DESKTOP_NOTEBOOK_CLOSING_READY_TO_CLOSE,
  DESKTOP_NOTEBOOK_CLOSING_STARTED,
  DesktopNotebookClosingState,
  makeDesktopNotebookRecord
} from "../../src/notebook/state";

const createStore = (
  contentRef,
  content,
  closingState: DesktopNotebookClosingState
) => ({
  getState: () => ({
    core: makeStateRecord({
      entities: makeEntitiesRecord({
        contents: makeContentsRecord({
          byRef: Immutable.Map({
            [contentRef]: content
          })
        })
      })
    }),
    desktopNotebook: makeDesktopNotebookRecord().set(
      "closingState",
      closingState
    )
  })
});

describe("onBeforeUnloadOrReload", () => {
  test("if we are not yet closing the notebook, should initiate closeNotebook and cancel close event", done => {
    const contentRef = createContentRef();
    const store = createStore(
      contentRef,
      makeNotebookContentRecord({
        model: makeDocumentRecord({
          notebook: "not same",
          savedNotebook: "different"
        })
      }),
      DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED
    );

    store.dispatch = action => {
      expect(action).toEqual(
        actions.closeNotebook({ contentRef, reloading: false })
      );
      done();
    };

    const event = {};

    const result = globalEvents.onBeforeUnloadOrReload(
      contentRef,
      store,
      false,
      event
    );
    expect(result).toBe(false);
  });

  test("if we are in the process of closing the notebook, should continue to cancel close event", () => {
    const contentRef = createContentRef();
    const store = createStore(
      contentRef,
      makeNotebookContentRecord({
        model: makeDocumentRecord({
          notebook: "not same",
          savedNotebook: "different"
        })
      }),
      DESKTOP_NOTEBOOK_CLOSING_STARTED
    );
    const event = {};
    const result = globalEvents.onBeforeUnloadOrReload(
      contentRef,
      store,
      event,
      false
    );
    expect(result).toBe(false);
  });

  test("if we have completed closing the notebook, should not cancel close event", () => {
    const contentRef = createContentRef();
    const store = createStore(
      contentRef,
      makeNotebookContentRecord({
        model: makeDocumentRecord({
          notebook: "not same",
          savedNotebook: "different"
        })
      }),
      DESKTOP_NOTEBOOK_CLOSING_READY_TO_CLOSE
    );
    const event = {};
    const result = globalEvents.onBeforeUnloadOrReload(
      contentRef,
      store,
      event,
      false
    );
    expect(result).toBeUndefined();
  });
});

describe("initGlobalHandlers", () => {
  test("adds an unload property to the window object", () => {
    const contentRef = createContentRef();
    const store = createStore(contentRef);

    globalEvents.initGlobalHandlers(contentRef, store);

    expect(global.window.onbeforeunload).toBeDefined();
  });

  test("wires a listener for a reload msg from main process", done => {
    const contentRef = createContentRef();
    const store = createStore(contentRef);

    ipc.on = event => {
      if (event === "reload") {
        done();
      }
    };

    globalEvents.initGlobalHandlers(contentRef, store);
  });
});
