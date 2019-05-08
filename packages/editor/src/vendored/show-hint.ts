import { createGlobalStyle } from "styled-components";

/**
 * Note that codemirror hint rendering is only controllable per entry within a list of
 * hints. The styling for our actual hint is in ../components/hint.tsx, but doesn't encompass
 * the .CodeMirror-hints container nor the individual entry .CodeMirror-hint.
 *
 * DOM structure wise, it looks like this:
 *
 * <ul class="CodeMirror-hints">
 *   <li class="CodeMirror-hint CodeMirror-hint-active">
 *     {elementWeControl}
 *   </li>
 *   <li class="CodeMirror-hint CodeMirror-hint-active">
 *     {anotherElementWeControl}
 *   </li>
 * </ul>
 */

export default createGlobalStyle`
/* From codemirror/addon/hint/show-hint.css */
/* There are overrides at the bottom of this stylesheet to cooperate with nteract */

.CodeMirror-hints {
  position: absolute;
  z-index: 10;
  overflow: hidden;
  list-style: none;

  margin: 0;
  padding: 2px;

  -webkit-box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  -moz-box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  box-shadow: 2px 3px 5px rgba(0,0,0,.2);
  border-radius: 3px;
  border: 1px solid silver;

  background: white;
  font-size: 90%;
  font-family: monospace;

  max-height: 20em;
  overflow-y: auto;
}

.CodeMirror-hint {
  margin: 0;
  padding: 0 4px;
  border-radius: 2px;
  white-space: pre;
  color: black;
  cursor: pointer;
}

li.CodeMirror-hint-active {
  background: #08f;
  color: white;
}

/*************************** OVERRIDES ***************************/
/* These styles override hint styling, used for code completion */

.CodeMirror-hints {
    -webkit-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    -moz-box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.2);
    border-radius: 0px;
    border: none;
    padding: 0;

    background: var(--cm-hint-bg, white);
    font-size: 90%;
    font-family: "Source Code Pro", monospace;

    /*_________*/
    z-index: 9001;  /* known as wow just bring it to the front, ignore the rest of the UI */

    overflow-y: auto;
  }

  .CodeMirror-hint {
    border-radius: 0px;
    white-space: pre;
    cursor: pointer;
    color: var(--cm-hint-color, black);
  }

  li.CodeMirror-hint-active {
    background: var(--cm-hint-bg-active, #abd1ff);
    color: var(--cm-hint-color-active, black);
  }

  /** Handle the type hint segment */
  .CodeMirror-hint {
    padding-left: 0;
    border-bottom: none;
  }
`;
