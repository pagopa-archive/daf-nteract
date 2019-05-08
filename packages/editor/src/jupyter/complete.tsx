import * as React from "react";
import ReactDOM from "react-dom";

import {
  childOf,
  createMessage,
  JupyterMessage,
  ofMessageType
} from "@nteract/messaging";
import { Channels } from "@nteract/messaging";
import { Doc, Editor, Position } from "codemirror";
import { Observable, Observer } from "rxjs";
import { first, map, timeout } from "rxjs/operators";

import { Hint } from "../components/hint";
import { char_idx_to_js_idx, js_idx_to_char_idx } from "./surrogate";

// Hint picker
export function pick(_cm: any, handle: { pick: () => void }): void {
  handle.pick();
}

export function formChangeObject<T, U>(cm: T, change: U) {
  return {
    cm,
    change
  };
}

interface CompletionResult {
  end: number;
  start: number;
  type: string;
  text: string;
  displayText?: string;
}

type CompletionMatch = string | CompletionResult;

interface CompletionResults {
  cursor_start: number;
  cursor_end: number;
  matches: CompletionMatch[];
  metadata?: {
    _jupyter_types_experimental?: any;
  };
}

// duplicate of default codemirror rendering logic for completions,
// except if the completion have a metadata._experimental key, dispatch to a new
// completer for these new values.
export const expand_completions = (editor: Doc) => (
  results: CompletionResults
) => {
  let start: number = results.cursor_start;
  let end: number = results.cursor_end;

  if (end === null) {
    // adapted message spec replies don't have cursor position info,
    // interpret end=null as current position,
    // and negative start relative to that
    end = editor.indexFromPos(editor.getCursor());
    if (start === null) {
      start = end;
    } else if (start < 0) {
      start = end + start;
    }
  } else {
    // handle surrogate pairs
    // HACK: This seems susceptible to timing issues, we could verify changes in
    //       what's in the editor, as we'll be able to correlate across events
    //       Suggestions and background in https://github.com/nteract/nteract/pull/1840#discussion_r133380430
    const text: string = editor.getValue();
    end = char_idx_to_js_idx(end, text);
    start = char_idx_to_js_idx(start, text);
  }

  const from: Position = editor.posFromIndex(start);
  const to: Position = editor.posFromIndex(end);

  let matches: CompletionMatch[] = results.matches;

  // ipykernel may return experimental completion in the metadata field,
  // experiment with these. We use codemirror ability to take a rendering
  // function on a per completion basis (we can't give a global one :-( to
  // render not only the text, but the type as well.
  // as this is not documented in CM the DOM structure of the completer will be
  //
  // <ul class="CodeMirror-hints" >
  //  <li class="CodeMirror-hint"></li>
  //  <li class="CodeMirror-hint CodeMirror-hint-active"></li>
  //  <li class="CodeMirror-hint"></li>
  //  <li class="CodeMirror-hint"></li>
  // </ul>
  // with each <li/> passed as the first argument of render.
  if (results.metadata && results.metadata._jupyter_types_experimental) {
    matches = results.metadata._jupyter_types_experimental;
  }

  function render(
    elt: HTMLElement,
    data: any, // Not used, it's the overall list of results
    // The "completion" result here is literally whatever object we return as
    // elements to the list return below, as CodeMirror uses this render
    // callback later
    completion: { text: string; type?: string }
  ): void {
    ReactDOM.render(<Hint {...completion} />, elt);
  }

  return {
    list: matches.map((match: CompletionMatch) => {
      if (typeof match === "string") {
        return { to, from, text: match, render };
      }

      return {
        to,
        from,
        render,
        ...match
      };
    }),
    from,
    to
  };
};

export function codeCompleteObservable(
  channels: Channels,
  editor: Doc,
  message: JupyterMessage
) {
  const completion$ = channels.pipe(
    childOf(message),
    ofMessageType("complete_reply"),
    map(entry => entry.content),
    first(),
    map(expand_completions(editor)),
    timeout(15000) // Large timeout for slower languages; this is just here to make sure we eventually clean up resources
  );

  // On subscription, send the message
  return Observable.create((observer: Observer<any>) => {
    const subscription = completion$.subscribe(observer);
    channels.next(message);
    return subscription;
  });
}

export const completionRequest = (code: string, cursorPos: number) =>
  createMessage("complete_request", {
    content: {
      code,
      cursor_pos: cursorPos
    }
  });

export function codeComplete(channels: Channels, editor: Doc) {
  const cursor = editor.getCursor();
  let cursorPos = editor.indexFromPos(cursor);
  const code = editor.getValue();
  cursorPos = js_idx_to_char_idx(cursorPos, code);

  const message = completionRequest(code, cursorPos);

  return codeCompleteObservable(channels, editor, message);
}
