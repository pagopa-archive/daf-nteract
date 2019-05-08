import { AppState } from "@nteract/core";
import * as Immutable from "immutable";

export type DesktopNotebookClosingState =
  | "Not Started" // Attempts to close BrowserWindow will initiate closeNotebookEpic and the window will be left open
  | "Started" // Attempts to close BrowserWindow will be ignored
  | "Ready to Close"; // The BrowserWindow will be allowed to close

export const DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED: DesktopNotebookClosingState =
  "Not Started";
export const DESKTOP_NOTEBOOK_CLOSING_STARTED: DesktopNotebookClosingState =
  "Started";
export const DESKTOP_NOTEBOOK_CLOSING_READY_TO_CLOSE: DesktopNotebookClosingState =
  "Ready to Close";

export interface DesktopNotebookProps {
  closingState: DesktopNotebookClosingState;
}

export type DesktopNotebookRecord = Immutable.RecordOf<DesktopNotebookProps>;

export const makeDesktopNotebookRecord = Immutable.Record<DesktopNotebookProps>(
  {
    closingState: DESKTOP_NOTEBOOK_CLOSING_NOT_STARTED
  }
);

export type DesktopNotebookAppState = AppState & {
  desktopNotebook: DesktopNotebookRecord;
};
