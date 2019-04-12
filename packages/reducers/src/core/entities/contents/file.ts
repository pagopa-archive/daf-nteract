// Vendor modules
import * as actions from "@nteract/actions";
import { FileModelRecord, FileModelRecordProps } from "@nteract/types";
import { RecordOf } from "immutable";

function updateFileText(
  state: FileModelRecord,
  action: actions.UpdateFileText
): RecordOf<FileModelRecordProps> {
  return state.set("text", action.payload.text);
}

export function file(
  state: FileModelRecord,
  action: actions.UpdateFileText
): RecordOf<FileModelRecordProps> {
  switch (action.type) {
    case actions.UPDATE_FILE_TEXT:
      return updateFileText(state, action);
    default:
      return state;
  }
}
