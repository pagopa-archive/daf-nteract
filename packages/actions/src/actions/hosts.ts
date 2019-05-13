/**
 * @module actions
 */

// Vendor modules
import { BookstoreDataModel, ContentRef } from "@nteract/types";

// Local modules
import * as actionTypes from "../actionTypes";

export const publishToBookstore = (payload: {
  contentRef: ContentRef;
}): actionTypes.PublishToBookstore => {
  return {
    type: actionTypes.PUBLISH_TO_BOOKSTORE,
    payload
  };
};

export const publishToBookstoreAfterSave = (payload: {
  contentRef: ContentRef;
  model: BookstoreDataModel;
}): actionTypes.PublishToBookstoreAfterSave => {
  return {
    type: actionTypes.PUBLISH_TO_BOOKSTORE_AFTER_SAVE,
    payload
  };
};

export const publishToBookstoreSucceeded = (payload: {
  contentRef: ContentRef;
}): actionTypes.PublishToBookstoreSucceeded => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_SUCCEEDED,
  payload
});

export const publishToBookstoreFailed = (payload: {
  contentRef: ContentRef;
  error: Error;
}): actionTypes.PublishToBookstoreFailed => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_FAILED,
  payload
});
