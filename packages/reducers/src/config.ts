// Vendor modules
import { MergeConfigAction, SetConfigAction } from "@nteract/actions";
import { ConfigState } from "@nteract/types";
import { Map } from "immutable";

type ConfigAction = SetConfigAction<any> | MergeConfigAction;

export function setConfigAtKey(
  state: ConfigState,
  action: SetConfigAction<any>
): Map<string, any> {
  const { key, value } = action.payload;
  return state.set(key, value);
}

export function mergeConfig(
  state: ConfigState,
  action: MergeConfigAction
): Map<string, any> {
  const { config } = action.payload;
  return state.merge(config);
}

export default function handleConfig(
  state: ConfigState = Map(),
  action: ConfigAction
): Map<string, any> {
  switch (action.type) {
    case "SET_CONFIG_AT_KEY":
      return setConfigAtKey(state, action);
    case "MERGE_CONFIG":
      return mergeConfig(state, action);
    default:
      return state;
  }
}
