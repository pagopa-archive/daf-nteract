import { ContentRef } from "@nteract/core";

import * as actionTypes from "./actionTypes";
import { DesktopNotebookClosingState } from "./state";

export function closeNotebook(payload: {
  contentRef: ContentRef;
  reloading: boolean;
}): actionTypes.CloseNotebook {
  return {
    type: actionTypes.CLOSE_NOTEBOOK,
    payload
  };
}

export function closeNotebookProgress(payload: {
  newState: DesktopNotebookClosingState;
}): actionTypes.CloseNotebookProgress {
  return {
    type: actionTypes.CLOSE_NOTEBOOK_PROGRESS,
    payload
  };
}

// Need to merge types from core actions with the actions defined here and actionTypes
export type Actions =
  | {
      type: string;
      payload?: any;
      error?: boolean;
    }
  | actionTypes.CloseNotebookProgress
  | actionTypes.CloseNotebook;
