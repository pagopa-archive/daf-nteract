// Local modules
import * as actionTypes from "../actionTypes";

export const setAppHost = (
  payload: actionTypes.SetAppHostAction["payload"]
): actionTypes.SetAppHostAction => ({
  type: actionTypes.SET_APP_HOST,
  payload
});
