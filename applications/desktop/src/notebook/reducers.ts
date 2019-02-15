import * as actionTypes from "./actionTypes";
import { DesktopNotebookRecord } from "./state";
import {
  DESKTOP_NOTEBOOK_CLOSING_STARTED,
  makeDesktopNotebookRecord
} from "./state";

export function handleDesktopNotebook(
  state: DesktopNotebookRecord = makeDesktopNotebookRecord(),
  action: actionTypes.CloseNotebook | actionTypes.CloseNotebookProgress
) {
  switch (action.type) {
    case actionTypes.CLOSE_NOTEBOOK:
      return state.set("closingState", DESKTOP_NOTEBOOK_CLOSING_STARTED);

    case actionTypes.CLOSE_NOTEBOOK_PROGRESS:
      return state.set("closingState", action.payload.newState);

    default:
      return state;
  }
}
