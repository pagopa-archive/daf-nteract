// Local modules
import * as actionTypes from "../actionTypes";

export const toggleHeaderEditor = (
  payload: actionTypes.ToggleHeaderEditor["payload"]
): actionTypes.ToggleHeaderEditor => ({
  type: actionTypes.TOGGLE_HEADER_EDITOR,
  payload
});

export const changeContentName = (
  payload: actionTypes.ChangeContentName["payload"]
): actionTypes.ChangeContentName => ({
  type: actionTypes.CHANGE_CONTENT_NAME,
  payload
});

export const changeContentNameFulfilled = (
  payload: actionTypes.ChangeContentNameFulfilled["payload"]
): actionTypes.ChangeContentNameFulfilled => ({
  type: actionTypes.CHANGE_CONTENT_NAME_FULFILLED,
  payload
});

export const changeContentNameFailed = (
  payload: actionTypes.ChangeContentNameFailed["payload"]
): actionTypes.ChangeContentNameFailed => ({
  type: actionTypes.CHANGE_CONTENT_NAME_FAILED,
  payload
});

export const fetchContent = (
  payload: actionTypes.FetchContent["payload"]
): actionTypes.FetchContent => ({
  type: actionTypes.FETCH_CONTENT,
  payload
});

export const fetchContentFulfilled = (
  payload: actionTypes.FetchContentFulfilled["payload"]
): actionTypes.FetchContentFulfilled => ({
  type: actionTypes.FETCH_CONTENT_FULFILLED,
  payload
});

export const fetchContentFailed = (
  payload: actionTypes.FetchContentFailed["payload"]
): actionTypes.FetchContentFailed => ({
  type: actionTypes.FETCH_CONTENT_FAILED,
  payload,
  error: true
});

export function changeFilename(
  payload: actionTypes.ChangeFilenameAction["payload"]
): actionTypes.ChangeFilenameAction {
  return {
    type: actionTypes.CHANGE_FILENAME,
    payload
  };
}

export function downloadContent(
  payload: actionTypes.DownloadContent["payload"]
): actionTypes.DownloadContent {
  return {
    type: actionTypes.DOWNLOAD_CONTENT,
    payload
  };
}

export function downloadContentFailed(
  payload: actionTypes.DownloadContentFailed["payload"]
): actionTypes.DownloadContentFailed {
  return {
    type: actionTypes.DOWNLOAD_CONTENT_FAILED,
    payload
  };
}

export function downloadContentFulfilled(
  payload: actionTypes.DownloadContentFulfilled["payload"]
): actionTypes.DownloadContentFulfilled {
  return {
    type: actionTypes.DOWNLOAD_CONTENT_FULFILLED,
    payload
  };
}

export function save(payload: actionTypes.Save["payload"]): actionTypes.Save {
  return {
    type: actionTypes.SAVE,
    payload
  };
}

export function saveAs(
  payload: actionTypes.SaveAs["payload"]
): actionTypes.SaveAs {
  return {
    type: actionTypes.SAVE_AS,
    payload
  };
}

export function saveFailed(
  payload: actionTypes.SaveFailed["payload"]
): actionTypes.SaveFailed {
  return {
    type: actionTypes.SAVE_FAILED,
    payload,
    error: true
  };
}

export function saveFulfilled(
  payload: actionTypes.SaveFulfilled["payload"]
): actionTypes.SaveFulfilled {
  return {
    type: actionTypes.SAVE_FULFILLED,
    payload
  };
}

export function saveAsFailed(
  payload: actionTypes.SaveAsFailed["payload"]
): actionTypes.SaveAsFailed {
  return {
    type: actionTypes.SAVE_AS_FAILED,
    payload,
    error: true
  };
}

export function saveAsFulfilled(
  payload: actionTypes.SaveAsFulfilled["payload"]
): actionTypes.SaveAsFulfilled {
  return {
    type: actionTypes.SAVE_AS_FULFILLED,
    payload
  };
}

// TODO: New Notebook action should use a kernel spec type
export function newNotebook(
  payload: actionTypes.NewNotebook["payload"]
): actionTypes.NewNotebook {
  return {
    type: actionTypes.NEW_NOTEBOOK,
    payload: {
      filepath: payload.filepath,
      kernelSpec: payload.kernelSpec,
      cwd: payload.cwd || process.cwd(), // Desktop should be passing in the cwd
      kernelRef: payload.kernelRef,
      contentRef: payload.contentRef
    }
  };
}

export function updateFileText(
  payload: actionTypes.UpdateFileText["payload"]
): actionTypes.UpdateFileText {
  return {
    type: actionTypes.UPDATE_FILE_TEXT,
    payload: {
      contentRef: payload.contentRef,
      text: payload.text
    }
  };
}
