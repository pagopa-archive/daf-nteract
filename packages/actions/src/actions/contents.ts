/**
 * @module actions
 */
import { ContentRef, KernelRef, KernelspecInfo } from "@nteract/types";

import * as actionTypes from "../actionTypes";

import { contents } from "rx-jupyter";

export const changeContentName = (payload: {
  filepath: string;
  contentRef: ContentRef;
  prevFilePath: string;
}): actionTypes.ChangeContentName => ({
  type: actionTypes.CHANGE_CONTENT_NAME,
  payload
});

export const changeContentNameFulfilled = (payload: {
  filepath: string;
  contentRef: ContentRef;
  prevFilePath: string;
}): actionTypes.ChangeContentNameFulfilled => ({
  type: actionTypes.CHANGE_CONTENT_NAME_FULFILLED,
  payload
});

export const changeContentNameFailed = (payload: {
  basepath: string;
  filepath: string;
  error: Error;
  contentRef: ContentRef;
  prevFilePath: string;
}): actionTypes.ChangeContentNameFailed => ({
  type: actionTypes.CHANGE_CONTENT_NAME_FAILED,
  payload
});

export const fetchContent = (
  payload: actionTypes.FetchContent["payload"]
): actionTypes.FetchContent => ({
  type: actionTypes.FETCH_CONTENT,
  payload
});

export const fetchContentFulfilled = (payload: {
  filepath: string;
  model: contents.IContent;
  kernelRef: KernelRef;
  contentRef: ContentRef;
}): actionTypes.FetchContentFulfilled => ({
  type: actionTypes.FETCH_CONTENT_FULFILLED,
  payload
});

export const fetchContentFailed = (payload: {
  filepath: string;
  error: Error;
  kernelRef: KernelRef;
  contentRef: ContentRef;
}): actionTypes.FetchContentFailed => ({
  type: actionTypes.FETCH_CONTENT_FAILED,
  payload,
  error: true
});

export function changeFilename(payload: {
  filepath?: string;
  contentRef: ContentRef;
}): actionTypes.ChangeFilenameAction {
  return {
    type: actionTypes.CHANGE_FILENAME,
    payload
  };
}

export function downloadContent(payload: {
  contentRef: ContentRef;
}): actionTypes.DownloadContent {
  return {
    type: actionTypes.DOWNLOAD_CONTENT,
    payload
  };
}

export function downloadContentFailed(payload: {
  contentRef: ContentRef;
}): actionTypes.DownloadContentFailed {
  return {
    type: actionTypes.DOWNLOAD_CONTENT_FAILED,
    payload
  };
}

export function downloadContentFulfilled(payload: {
  contentRef: ContentRef;
}): actionTypes.DownloadContentFulfilled {
  return {
    type: actionTypes.DOWNLOAD_CONTENT_FULFILLED,
    payload
  };
}

export function save(payload: { contentRef: ContentRef }): actionTypes.Save {
  return {
    type: actionTypes.SAVE,
    payload
  };
}

export function saveAs(payload: {
  filepath: string;
  contentRef: ContentRef;
}): actionTypes.SaveAs {
  return {
    type: actionTypes.SAVE_AS,
    payload
  };
}

export function saveFailed(payload: {
  error: Error;
  contentRef: ContentRef;
}): actionTypes.SaveFailed {
  return {
    type: actionTypes.SAVE_FAILED,
    payload,
    error: true
  };
}

export function saveFulfilled(payload: {
  contentRef: ContentRef;
  model: any;
}): actionTypes.SaveFulfilled {
  return {
    type: actionTypes.SAVE_FULFILLED,
    payload
  };
}

// TODO: New Notebook action should use a kernel spec type
export function newNotebook(payload: {
  kernelSpec: KernelspecInfo;
  cwd: string;
  kernelRef: KernelRef;
  contentRef: ContentRef;
}): actionTypes.NewNotebook {
  return {
    type: actionTypes.NEW_NOTEBOOK,
    payload: {
      kernelSpec: payload.kernelSpec,
      cwd: payload.cwd || process.cwd(), // Desktop should be passing in the cwd
      kernelRef: payload.kernelRef,
      contentRef: payload.contentRef
    }
  };
}

export function updateFileText(payload: {
  contentRef: ContentRef;
  text: string;
}): actionTypes.UpdateFileText {
  return {
    type: actionTypes.UPDATE_FILE_TEXT,
    payload: {
      contentRef: payload.contentRef,
      text: payload.text
    }
  };
}
