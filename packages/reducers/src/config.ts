import { Map } from "immutable";

import { MergeConfigAction, SetConfigAction } from "@nteract/actions";
import { ConfigState } from "@nteract/types";

type ConfigAction = SetConfigAction<any> | MergeConfigAction;

export function setConfigAtKey(
  state: ConfigState,
  action: SetConfigAction<any>
) {
  const { key, value } = action.payload;
  return state.set(key, value);
}

export function mergeConfig(state: ConfigState, action: MergeConfigAction) {
  const { config } = action.payload;
  return state.merge(config);
}

export default function handleConfig(
  state: ConfigState = Map(),
  action: ConfigAction
) {
  switch (action.type) {
    case "SET_CONFIG_AT_KEY":
      return setConfigAtKey(state, action);
    case "MERGE_CONFIG":
      return mergeConfig(state, action);
    default:
      return state;
  }
}
