import { of, Subject } from "rxjs";
import { toArray } from "rxjs/operators";

import * as actions from "@nteract/actions";
import { COMM_MESSAGE, COMM_OPEN } from "@nteract/actions";
import { ActionsObservable } from "redux-observable";
import {
  commListenEpic,
  createCommCloseMessage,
  createCommMessage,
  createCommOpenMessage
} from "../src/comm";

describe("createCommMessage", () => {
  test("creates a comm_msg", () => {
    const commMessage = createCommMessage("0000", { hey: "is for horses" });

    expect(commMessage.content.data).toEqual({ hey: "is for horses" });
    expect(commMessage.content.comm_id).toBe("0000");
    expect(commMessage.header.msg_type).toBe("comm_msg");
  });
});

describe("createCommOpenMessage", () => {
  test("creates a comm_open", () => {
    const commMessage = createCommOpenMessage(
      "0001",
      "myTarget",
      {
        hey: "is for horses"
      },
      "targetModule"
    );

    expect(commMessage.content).toEqual({
      comm_id: "0001",
      target_name: "myTarget",
      data: { hey: "is for horses" },
      target_module: "targetModule"
    });
  });
  test("can specify a target_module", () => {
    const commMessage = createCommOpenMessage(
      "0001",
      "myTarget",
      { hey: "is for horses" },
      "Dr. Pepper"
    );

    expect(commMessage.content).toEqual({
      comm_id: "0001",
      target_name: "myTarget",
      data: { hey: "is for horses" },
      target_module: "Dr. Pepper"
    });
  });
});

describe("createCommCloseMessage", () => {
  test("creates a comm_msg", () => {
    const parent_header = { id: "23" };

    const commMessage = createCommCloseMessage(parent_header, "0000", {
      hey: "is for horses"
    });

    expect(commMessage.content.data).toEqual({ hey: "is for horses" });
    expect(commMessage.content.comm_id).toBe("0000");
    expect(commMessage.header.msg_type).toBe("comm_close");
    expect(commMessage.parent_header).toEqual(parent_header);
  });
});

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
