import { CellId, CellType } from "@nteract/commutable";
import { ContentRef, KernelRef } from "@nteract/types";

import { JSONObject } from "@nteract/commutable";
import * as actionTypes from "../actionTypes";

export function setExecutionState(payload: {
  kernelStatus: string;
  kernelRef: KernelRef;
}): actionTypes.SetExecutionStateAction {
  return {
    type: actionTypes.SET_EXECUTION_STATE,
    payload
  };
}

export function clearOutputs(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.ClearOutputs {
  return {
    type: actionTypes.CLEAR_OUTPUTS,
    payload
  };
}

export function clearAllOutputs(payload: {
  contentRef: ContentRef;
}): actionTypes.ClearAllOutputs {
  return {
    type: actionTypes.CLEAR_ALL_OUTPUTS,
    payload
  };
}

export function moveCell(payload: {
  id: string;
  destinationId: string;
  above: boolean;
  contentRef: ContentRef;
}): actionTypes.MoveCell {
  return {
    type: actionTypes.MOVE_CELL,
    payload
  };
}

export function deleteCell(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.DeleteCell {
  return {
    type: actionTypes.DELETE_CELL,
    payload
  };
}

export function createCellBelow(payload: {
  id?: CellId;
  cellType: CellType;
  source: string;
  contentRef: ContentRef;
}): actionTypes.CreateCellBelow {
  return {
    type: actionTypes.CREATE_CELL_BELOW,
    payload
  };
}

export function createCellAbove(payload: {
  cellType: CellType;
  id?: string;
  contentRef: ContentRef;
}): actionTypes.CreateCellAbove {
  return {
    type: actionTypes.CREATE_CELL_ABOVE,
    payload
  };
}

// Deprecation Warning: removeCell() is being deprecated. Please use deleteCell() instead
export function removeCell(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.RemoveCell {
  return {
    type: actionTypes.REMOVE_CELL,
    payload
  };
}

// Deprecation Warning: createCellAfter() is being deprecated. Please use createCellBelow() instead
export function createCellAfter(payload: {
  id?: CellId;
  cellType: CellType;
  source: string;
  contentRef: ContentRef;
}): actionTypes.CreateCellAfter {
  return {
    type: actionTypes.CREATE_CELL_AFTER,
    payload
  };
}

// Deprecation Warning: createCellBefore is deprecated. Please use createCellAbove() instead
export function createCellBefore(payload: {
  cellType: CellType;
  id?: string;
  contentRef: ContentRef;
}): actionTypes.CreateCellBefore {
  return {
    type: actionTypes.CREATE_CELL_BEFORE,
    payload
  };
}

export function createCellAppend(payload: {
  cellType: CellType;
  contentRef: ContentRef;
}): actionTypes.CreateCellAppend {
  return {
    type: actionTypes.CREATE_CELL_APPEND,
    payload
  };
}

export function toggleParameterCell(payload: {
  id: CellId;
  contentRef: ContentRef;
}): actionTypes.ToggleTagInCell {
  // Tag comes via Papermill
  return toggleTagInCell({
    id: payload.id,
    contentRef: payload.contentRef,
    tag: "parameters"
  });
}

export function toggleTagInCell(payload: {
  id: CellId;
  contentRef: ContentRef;
  tag: string;
}): actionTypes.ToggleTagInCell {
  return {
    type: actionTypes.TOGGLE_TAG_IN_CELL,
    payload
  };
}

/**
 * setInCell can generically be used to set any attribute on a cell, including
 * and especially for changing metadata per cell.
 * @param {CellId} payload.id    cell ID
 * @param {Array<string>} payload.path  path within a cell to set
 * @param {any} payload.value what to set it to
 *
 * Example:
 *
 * > action = setInCell('123', ['metadata', 'cool'], true)
 * > documentReducer(state, action)
 * {
 *   ...
 *   '123': {
 *     'metadata': {
 *       'cool': true
 *     }
 *   }
 * }
 *
 */
export function setInCell<T>(payload: {
  id: CellId;
  path: string[];
  value: T;
  contentRef: ContentRef;
}): actionTypes.SetInCell<T> {
  return {
    type: actionTypes.SET_IN_CELL,
    payload
  };
}

export function updateCellSource(payload: {
  id: CellId;
  value: string;
  contentRef: ContentRef;
}): actionTypes.SetInCell<string> {
  return setInCell({ ...payload, path: ["source"] });
}

export function updateCellExecutionCount(payload: {
  id: CellId;
  value: number;
  contentRef: ContentRef;
}): actionTypes.SetInCell<number> {
  return setInCell({ ...payload, path: ["execution_count"] });
}

export function unhideAll(
  payload: actionTypes.UnhideAll["payload"]
): actionTypes.UnhideAll {
  return {
    type: "UNHIDE_ALL",
    payload
  };
}

export function toggleCellOutputVisibility(payload: {
  id?: CellId;
  contentRef: ContentRef;
}): actionTypes.ToggleCellOutputVisibility {
  return {
    type: actionTypes.TOGGLE_CELL_OUTPUT_VISIBILITY,
    payload
  };
}

export function toggleCellInputVisibility(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.ToggleCellInputVisibility {
  return {
    type: actionTypes.TOGGLE_CELL_INPUT_VISIBILITY,
    payload
  };
}

export function updateCellStatus(payload: {
  id: string;
  status: string;
  contentRef: ContentRef;
}): actionTypes.UpdateCellStatus {
  return {
    type: actionTypes.UPDATE_CELL_STATUS,
    payload
  };
}

/* Unlike focus next & previous, to set focus, we require an ID,
     because the others are based on there already being a focused cell */
export function focusCell(payload: {
  id: CellId;
  contentRef: ContentRef;
}): actionTypes.FocusCell {
  return {
    type: actionTypes.FOCUS_CELL,
    payload
  };
}

export function focusNextCell(payload: {
  id?: string;
  createCellIfUndefined: boolean;
  contentRef: ContentRef;
}): actionTypes.FocusNextCell {
  return {
    type: actionTypes.FOCUS_NEXT_CELL,
    payload
  };
}

export function focusNextCellEditor(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.FocusNextCellEditor {
  return {
    type: actionTypes.FOCUS_NEXT_CELL_EDITOR,
    payload
  };
}

export function focusPreviousCell(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.FocusPreviousCell {
  return {
    type: actionTypes.FOCUS_PREVIOUS_CELL,
    payload
  };
}

export function focusCellEditor(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.FocusCellEditor {
  return {
    type: actionTypes.FOCUS_CELL_EDITOR,
    payload
  };
}

export function focusPreviousCellEditor(payload: {
  id?: string;
  contentRef: ContentRef;
}): actionTypes.FocusPreviousCellEditor {
  return {
    type: actionTypes.FOCUS_PREVIOUS_CELL_EDITOR,
    payload
  };
}

export function copyCell(payload: {
  id?: CellId;
  contentRef: ContentRef;
}): actionTypes.CopyCell {
  return {
    type: actionTypes.COPY_CELL,
    payload
  };
}

export function cutCell(payload: {
  id?: CellId;
  contentRef: ContentRef;
}): actionTypes.CutCell {
  return {
    type: actionTypes.CUT_CELL,
    payload
  };
}

export function pasteCell(payload: {
  contentRef: ContentRef;
}): actionTypes.PasteCell {
  return {
    type: actionTypes.PASTE_CELL,
    payload
  };
}

export function changeCellType(payload: {
  id?: CellId;
  to: CellType;
  contentRef: ContentRef;
}): actionTypes.ChangeCellType {
  return {
    type: actionTypes.CHANGE_CELL_TYPE,
    payload
  };
}

export function updateOutputMetadata(payload: {
  id: CellId;
  metadata: JSONObject;
  contentRef: ContentRef;
  index: number;
  mediaType: string;
}): actionTypes.UpdateOutputMetadata {
  return {
    type: actionTypes.UPDATE_OUTPUT_METADATA,
    payload
  };
}

export function promptInputRequest(payload: {
  id: CellId;
  contentRef: ContentRef;
  prompt: string;
  password: boolean;
}): actionTypes.PromptInputRequest {
  return {
    type: actionTypes.PROMPT_INPUT_REQUEST,
    payload
  };
}

export function sendInputReply(
  payload: actionTypes.SendInputReply["payload"]
): actionTypes.SendInputReply {
  return {
    type: actionTypes.SEND_INPUT_REPLY,
    payload
  };
}
