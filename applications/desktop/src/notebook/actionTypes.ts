import { ContentRef } from "@nteract/core";

import { DesktopNotebookClosingState } from "./state";

export const CLOSE_NOTEBOOK = "DESKTOP/CLOSE_NOTEBOOK";
export interface CloseNotebook {
  type: "DESKTOP/CLOSE_NOTEBOOK";
  payload: {
    contentRef: ContentRef;
    reloading: boolean;
  };
}

export const CLOSE_NOTEBOOK_PROGRESS = "DESKTOP/CLOSE_NOTEBOOK_PROGRESS";
export interface CloseNotebookProgress {
  type: "DESKTOP/CLOSE_NOTEBOOK_PROGRESS";
  payload: {
    newState: DesktopNotebookClosingState;
  };
}
