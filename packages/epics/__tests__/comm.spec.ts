import { of, Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import * as actions from "@nteract/actions";
import { COMM_MESSAGE, COMM_OPEN } from "@nteract/actions";
import { ActionsObservable } from "redux-observable";
import { commListenEpic } from "../src/comm";

describe("commActionObservable", () => {
  test("emits COMM_OPEN and COMM_MESSAGE given the right messages", done => {
    const commOpenMessage = {
      header: { msg_type: "comm_open" },
      content: {
        data: "DATA",
        metadata: "0",
        comm_id: "0123",
        target_name: "daredevil",
        target_module: "murdock"
      },
      buffers: new Uint8Array([])
    };

    const commMessage = {
      header: { msg_type: "comm_msg" },
      content: { data: "DATA", comm_id: "0123" },
      buffers: new Uint8Array([])
    };

    const action = ActionsObservable.of(
      actions.launchKernelSuccessful({
        kernel: {
          channels: of(commOpenMessage, commMessage) as Subject<any>,
          cwd: "/home/tester",
          type: "websocket"
        },
        kernelRef: "fakeKernelRef",
        contentRef: "fakeContentRef",
        selectNextKernel: false
      })
    );

    commListenEpic(action)
      .pipe(toArray())
      .subscribe(
        actions => {
          expect(actions).toEqual([
            {
              type: "COMM_OPEN",
              data: "DATA",
              metadata: "0",
              comm_id: "0123",
              target_name: "daredevil",
              target_module: "murdock",
              buffers: new Uint8Array([])
            },
            {
              type: "COMM_MESSAGE",
              data: "DATA",
              comm_id: "0123",
              buffers: new Uint8Array([])
            }
          ]);
        },
        err => done.fail(err),
        () => done()
      ); // It should not error in the stream
  });
});
