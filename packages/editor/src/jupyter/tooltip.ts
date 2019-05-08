import {
  Channels,
  childOf,
  createMessage,
  JupyterMessage,
  ofMessageType
} from "@nteract/messaging";
import { Doc, Editor, Position } from "codemirror";
import { Observable, Observer } from "rxjs";
import { first, map } from "rxjs/operators";

import { js_idx_to_char_idx } from "./surrogate";

export function tooltipObservable(
  channels: Channels,
  _editor: Editor & Doc,
  message: JupyterMessage
) {
  const tip$ = channels.pipe(
    childOf(message),
    ofMessageType("inspect_reply"),
    map((entry: JupyterMessage) => entry.content),
    first(),
    map(results => ({
      dict: results.data
    }))
  );
  // On subscription, send the message
  return Observable.create((observer: Observer<any>) => {
    const subscription = tip$.subscribe(observer);
    channels.next(message);
    return subscription;
  });
}

export function tooltipRequest(
  code: string,
  cursorPos: number
): JupyterMessage<"inspect_request", any> {
  return createMessage("inspect_request", {
    content: {
      code,
      cursor_pos: cursorPos,
      detail_level: 0
    }
  });
}

export function tool(channels: Channels, editor: Editor & Doc) {
  const cursor: Position = editor.getCursor();
  // Get position while handling surrogate pairs
  const cursorPos: number = js_idx_to_char_idx(
    editor.indexFromPos(cursor),
    editor.getValue()
  );
  const code: string = editor.getValue();

  const message: JupyterMessage<"inspect_request", any> = tooltipRequest(
    code,
    cursorPos
  );
  return tooltipObservable(channels, editor, message);
}
