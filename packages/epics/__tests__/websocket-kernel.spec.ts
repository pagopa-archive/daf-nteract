import * as Immutable from "immutable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import * as actions from "@nteract/actions";
import * as stateModule from "@nteract/types";

import * as coreEpics from "../src";

describe("launchWebSocketKernelEpic", () => {
  test("launches remote kernels", async () => {
    const contentRef = "fakeContentRef";
    const kernelRef = "fake";
    const hostRef = "fakeHostRef";
    const value = {
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({}),
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              fakeContentRef: stateModule.makeNotebookContentRecord()
            })
          }),
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          }),
          hosts: stateModule.makeHostsRecord({
            byRef: Immutable.Map({
              [hostRef]: stateModule.makeJupyterHostRecord({
                type: "jupyter",
                token: "eh",
                basePath: "http://localhost:8888/"
              })
            })
          })
        })
      })
    };
    const state$ = new StateObservable(
      new Subject<stateModule.AppState>(),
      value
    );
    const action$ = ActionsObservable.of(
      actions.launchKernelByName({
        contentRef,
        kernelRef,
        kernelSpecName: "fancy",
        cwd: "/",
        selectNextKernel: true
      })
    );

    const responseActions = await coreEpics
      .launchWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: "LAUNCH_KERNEL_SUCCESSFUL",
        payload: {
          contentRef,
          kernelRef,
          selectNextKernel: true,
          kernel: {
            info: null,
            sessionId: "1",
            hostRef,
            type: "websocket",
            channels: expect.any(Subject),
            kernelSpecName: "fancy",
            cwd: "/",
            id: "0"
          }
        }
      }
    ]);
  });
});

describe("interruptKernelEpic", () => {
  test("can interrupt a kernel when given a kernel ref", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.interruptKernel({ kernelRef: "fake" })
    );

    const responseActions = await coreEpics
      .interruptKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: "INTERRUPT_KERNEL_SUCCESSFUL",
        payload: { kernelRef: "fake" }
      }
    ]);
  });
  test("can interrupt a kernel when given a content ref", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fakeKernelRef: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          }),
          contents: stateModule.makeContentsRecord({
            byRef: Immutable.Map({
              contentRef: stateModule.makeNotebookContentRecord({
                model: stateModule.makeDocumentRecord({
                  kernelRef: "fakeKernelRef"
                })
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.interruptKernel({ contentRef: "contentRef" })
    );

    const responseActions = await coreEpics
      .interruptKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: "INTERRUPT_KERNEL_SUCCESSFUL",
        payload: { kernelRef: undefined }
      }
    ]);
  });
});

describe("restartKernelEpic", () => {
  test("does not execute restart if no kernelRef is passed", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: null,
        contentRef: "contentRef",
        outputHandling: "None"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_FAILED,
        error: true,
        payload: {
          error: new Error("Can't execute restart without kernel ref."),
          kernelRef: "none provided",
          contentRef: "contentRef"
        }
      }
    ]);
  });
  test("does not execute restart if host type is not Jupyter", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeLocalHostRecord({
          type: "local"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: "fake",
        contentRef: "contentRef",
        outputHandling: "None"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_FAILED,
        error: true,
        payload: {
          error: new Error("Can't restart a kernel with no Jupyter host."),
          kernelRef: "fake",
          contentRef: "contentRef"
        }
      }
    ]);
  });
  test("does not execute restart if no kernel exists with kernelRef", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              notFake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: "fake",
        contentRef: "contentRef",
        outputHandling: "None"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_FAILED,
        error: true,
        payload: {
          error: new Error("Can't restart a kernel that does not exist."),
          kernelRef: "fake",
          contentRef: "contentRef"
        }
      }
    ]);
  });
  test("restarts kernel if given valid kernel ref", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: "fake",
        contentRef: "contentRef",
        outputHandling: "None"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_SUCCESSFUL,
        payload: {
          kernelRef: "fake",
          contentRef: "contentRef"
        }
      }
    ]);
  });
  test("respects output handling for running all cells", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: "fake",
        contentRef: "contentRef",
        outputHandling: "Run All"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_SUCCESSFUL,
        payload: {
          kernelRef: "fake",
          contentRef: "contentRef"
        }
      },
      {
        type: actions.EXECUTE_ALL_CELLS,
        payload: {
          contentRef: "contentRef"
        }
      }
    ]);
  });
  test("respects output handling for clearing all cells", async () => {
    const state$ = new StateObservable(new Subject<stateModule.AppState>(), {
      core: stateModule.makeStateRecord({
        kernelRef: "fake",
        entities: stateModule.makeEntitiesRecord({
          kernels: stateModule.makeKernelsRecord({
            byRef: Immutable.Map({
              fake: stateModule.makeRemoteKernelRecord({
                type: "websocket",
                channels: new Subject<any>(),
                kernelSpecName: "fancy",
                id: "0"
              })
            })
          })
        })
      }),
      app: stateModule.makeAppRecord({
        host: stateModule.makeJupyterHostRecord({
          type: "jupyter",
          token: "eh",
          basePath: "http://localhost:8888/"
        }),
        notificationSystem: { addNotification: jest.fn() }
      }),
      comms: stateModule.makeCommsRecord(),
      config: Immutable.Map({})
    });
    const action$ = ActionsObservable.of(
      actions.restartKernel({
        kernelRef: "fake",
        contentRef: "contentRef",
        outputHandling: "Clear All"
      })
    );

    const responseActions = await coreEpics
      .restartWebSocketKernelEpic(action$, state$)
      .pipe(toArray())
      .toPromise();

    expect(responseActions).toEqual([
      {
        type: actions.RESTART_KERNEL_SUCCESSFUL,
        payload: {
          kernelRef: "fake",
          contentRef: "contentRef"
        }
      },
      {
        type: actions.CLEAR_ALL_OUTPUTS,
        payload: {
          contentRef: "contentRef"
        }
      }
    ]);
  });
});
