// Local modules
import * as actionTypes from "../actionTypes";

export const publishToBookstore = (
  payload: actionTypes.PublishToBookstore["payload"]
): actionTypes.PublishToBookstore => {
  return {
    type: actionTypes.PUBLISH_TO_BOOKSTORE,
    payload
  };
};

export const publishToBookstoreAfterSave = (
  payload: actionTypes.PublishToBookstoreAfterSave["payload"]
): actionTypes.PublishToBookstoreAfterSave => {
  return {
    type: actionTypes.PUBLISH_TO_BOOKSTORE_AFTER_SAVE,
    payload
  };
};

export const publishToBookstoreSucceeded = (
  payload: actionTypes.PublishToBookstoreSucceeded["payload"]
): actionTypes.PublishToBookstoreSucceeded => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_SUCCEEDED,
  payload
});

export const publishToBookstoreFailed = (
  payload: actionTypes.PublishToBookstoreFailed["payload"]
): actionTypes.PublishToBookstoreFailed => ({
  type: actionTypes.PUBLISH_TO_BOOKSTORE_FAILED,
  payload
});
