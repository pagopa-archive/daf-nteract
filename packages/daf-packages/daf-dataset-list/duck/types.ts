import { actionDomain } from "./utils";

const DATASETLIST_REQUEST = actionDomain + "REQUEST";
const DATASETLIST_FULFILL = actionDomain + "FULFILL";
const DATASETLIST_REJECT = actionDomain + "REJECT";
const DATASETLIST_RESET = actionDomain + "RESET";

export {
  DATASETLIST_REQUEST,
  DATASETLIST_FULFILL,
  DATASETLIST_REJECT,
  DATASETLIST_RESET
};
