// Vendor modules
import * as actions from "@nteract/actions";
import { makeTransformsRecord } from "@nteract/types";
import { List, Map } from "immutable";
import { Action, Reducer } from "redux";
import { combineReducers } from "redux-immutable";

const byId = (
  state = Map<string, React.ComponentClass>(),
  action: Action
): Map<string, React.ComponentClass> => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      typedAction = action as actions.AddTransform;
      return state.set(
        typedAction.payload.mediaType,
        typedAction.payload.component
      );
    case actions.REMOVE_TRANSFORM:
      typedAction = action as actions.RemoveTransform;
      return state.delete(typedAction.payload.mediaType);
    default:
      return state;
  }
};

const displayOrder = (
  state = List() as List<string>,
  action: Action
): List<string> => {
  let typedAction;
  switch (action.type) {
    case actions.ADD_TRANSFORM:
      typedAction = action as actions.AddTransform;
      return state.push(typedAction.payload.mediaType);
    case actions.REMOVE_TRANSFORM:
      typedAction = action as actions.RemoveTransform;
      return state.delete(state.indexOf(typedAction.payload.mediaType));
    default:
      return state;
  }
};

export const transforms: Reducer<
  {
    byId: Map<string, React.ComponentClass>;
    displayOrder: List<any>;
  },
  Action<any>
> = combineReducers({ byId, displayOrder }, makeTransformsRecord as any);
