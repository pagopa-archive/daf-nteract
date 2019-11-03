import { CellId, CellType, JSONObject } from "@nteract/commutable";
import { ContentRef } from "@nteract/types";

export const TOGGLE_TAG_IN_CELL = "CORE/TOGGLE_TAG_IN_CELL";
export interface ToggleTagInCell {
  // expectation is that if a tag doesn't exist, it will set it
  // if the tag is already in the collection of tags it will delete it
  type: "CORE/TOGGLE_TAG_IN_CELL";
  payload: {
    id: CellId;
    tag: string;
    contentRef: ContentRef;
  };
}

export const SET_IN_CELL = "SET_IN_CELL";
export interface SetInCell<T> {
  type: "SET_IN_CELL";
  payload: {
    id: CellId;
    path: string[];
    value: T;
    contentRef: ContentRef;
  };
}

export const MOVE_CELL = "MOVE_CELL";
export interface MoveCell {
  type: "MOVE_CELL";
  payload: {
    id: CellId;
    destinationId: CellId;
    above: boolean;
    contentRef: ContentRef;
  };
}

export const DELETE_CELL = "DELETE_CELL";
export interface DeleteCell {
  type: "DELETE_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const CREATE_CELL_BELOW = "CREATE_CELL_BELOW";
export interface CreateCellBelow {
  type: "CREATE_CELL_BELOW";
  payload: {
    id?: CellId;
    cellType: CellType;
    source: string;
    contentRef: ContentRef;
  };
}

export const CREATE_CELL_ABOVE = "CREATE_CELL_ABOVE";
export interface CreateCellAbove {
  type: "CREATE_CELL_ABOVE";
  payload: {
    cellType: CellType;
    id?: CellId;
    contentRef: ContentRef;
  };
}

// Deprecation Warning: This action type is being deprecated. Please use DELETE_CELL instead
export const REMOVE_CELL = "REMOVE_CELL";
export interface RemoveCell {
  type: "REMOVE_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

// DEPRECATION WARNING: This action type is being deprecated. Please use CREATE_CELL_BELOW instead
export const CREATE_CELL_AFTER = "CREATE_CELL_AFTER";
export interface CreateCellAfter {
  type: "CREATE_CELL_AFTER";
  payload: {
    id?: CellId;
    cellType: CellType;
    source: string;
    contentRef: ContentRef;
  };
}

// DEPRECATION WARNING: This action type is being deprecated. Please use CREATE_CELL_ABOVE instead
export const CREATE_CELL_BEFORE = "CREATE_CELL_BEFORE";
export interface CreateCellBefore {
  type: "CREATE_CELL_BEFORE";
  payload: {
    cellType: CellType;
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const CREATE_CELL_APPEND = "CREATE_CELL_APPEND";
export interface CreateCellAppend {
  type: "CREATE_CELL_APPEND";
  payload: {
    cellType: CellType;
    contentRef: ContentRef;
  };
}

export const UNHIDE_ALL = "UNHIDE_ALL";
export interface UnhideAll {
  type: "UNHIDE_ALL";
  payload: {
    inputHidden?: boolean;
    outputHidden?: boolean;
    contentRef: ContentRef;
  };
}

export const TOGGLE_CELL_OUTPUT_VISIBILITY = "TOGGLE_CELL_OUTPUT_VISIBILITY";
export interface ToggleCellOutputVisibility {
  type: "TOGGLE_CELL_OUTPUT_VISIBILITY";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const TOGGLE_CELL_INPUT_VISIBILITY = "TOGGLE_CELL_INPUT_VISIBILITY";
export interface ToggleCellInputVisibility {
  type: "TOGGLE_CELL_INPUT_VISIBILITY";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const CLEAR_OUTPUTS = "CLEAR_OUTPUTS";
export interface ClearOutputs {
  type: "CLEAR_OUTPUTS";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const CLEAR_ALL_OUTPUTS = "CLEAR_ALL_OUTPUTS";
export interface ClearAllOutputs {
  type: "CLEAR_ALL_OUTPUTS";
  payload: { contentRef: ContentRef };
}

export const FOCUS_CELL = "FOCUS_CELL";
export interface FocusCell {
  type: "FOCUS_CELL";
  payload: {
    id: CellId;
    contentRef: ContentRef;
  };
}

export const FOCUS_NEXT_CELL = "FOCUS_NEXT_CELL";
export interface FocusNextCell {
  type: "FOCUS_NEXT_CELL";
  payload: {
    id?: CellId;
    createCellIfUndefined: boolean;
    contentRef: ContentRef;
  };
}

export const FOCUS_PREVIOUS_CELL = "FOCUS_PREVIOUS_CELL";
export interface FocusPreviousCell {
  type: "FOCUS_PREVIOUS_CELL";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const FOCUS_CELL_EDITOR = "FOCUS_CELL_EDITOR";
export interface FocusCellEditor {
  type: "FOCUS_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const FOCUS_NEXT_CELL_EDITOR = "FOCUS_NEXT_CELL_EDITOR";
export interface FocusNextCellEditor {
  type: "FOCUS_NEXT_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const FOCUS_PREVIOUS_CELL_EDITOR = "FOCUS_PREVIOUS_CELL_EDITOR";
export interface FocusPreviousCellEditor {
  type: "FOCUS_PREVIOUS_CELL_EDITOR";
  payload: {
    id?: CellId;
    contentRef: ContentRef;
  };
}

export const CUT_CELL = "CUT_CELL";
export interface CutCell {
  type: "CUT_CELL";
  payload: { id?: CellId; contentRef: ContentRef };
}

export const COPY_CELL = "COPY_CELL";
export interface CopyCell {
  type: "COPY_CELL";
  payload: { id?: CellId; contentRef: ContentRef };
}

export const PASTE_CELL = "PASTE_CELL";
export interface PasteCell {
  type: "PASTE_CELL";
  payload: { contentRef: ContentRef };
}

export const CHANGE_CELL_TYPE = "CHANGE_CELL_TYPE";
export interface ChangeCellType {
  type: "CHANGE_CELL_TYPE";
  payload: {
    id?: CellId;
    to: CellType;
    contentRef: ContentRef;
  };
}

export const UPDATE_CELL_STATUS = "UPDATE_CELL_STATUS";
export interface UpdateCellStatus {
  type: "UPDATE_CELL_STATUS";
  payload: {
    id: CellId;
    status: string;
    contentRef: ContentRef;
  };
}

export const UPDATE_OUTPUT_METADATA = "UPDATE_OUTPUT_METADATA";
export interface UpdateOutputMetadata {
  type: "UPDATE_OUTPUT_METADATA";
  payload: {
    id: CellId;
    contentRef: ContentRef;
    metadata: JSONObject;
    index: number;
    mediaType: string;
  };
}

export const PROMPT_INPUT_REQUEST = "PROMPT_INPUT_REQUEST";
export interface PromptInputRequest {
  type: "PROMPT_INPUT_REQUEST";
  payload: {
    id: CellId;
    contentRef: ContentRef;
    prompt: string;
    password: boolean;
  };
}

export const SEND_INPUT_REPLY = "SEND_INPUT_REPLY";
export interface SendInputReply {
  type: "SEND_INPUT_REPLY";
  payload: {
    value: string;
    contentRef: ContentRef;
  };
}
