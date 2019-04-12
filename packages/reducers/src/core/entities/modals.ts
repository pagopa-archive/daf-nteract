// Vendor modules
import * as actions from "@nteract/actions";
import { makeModalsRecord } from "@nteract/types";
import { Action, Reducer } from "redux";
import { combineReducers } from "redux-immutable";

const modalType = (
  state: string = "",
  action: actions.OpenModal | actions.CloseModal
): string => {
  switch (action.type) {
    case actions.OPEN_MODAL:
      return action.payload.modalType;
    case actions.CLOSE_MODAL:
      return "";
    default:
      return state;
  }
};

export const modals: Reducer<
  {
    modalType: string;
  },
  Action<any>
> = combineReducers({ modalType }, makeModalsRecord as any);
