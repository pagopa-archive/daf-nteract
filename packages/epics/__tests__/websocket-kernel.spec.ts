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
  test("", async () => {
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
});
