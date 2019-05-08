// Vendor modules
import {
  CommMessageAction,
  CommOpenAction,
  RegisterCommTargetAction
} from "@nteract/actions";
import { CommsRecord, makeCommsRecord } from "@nteract/types";
import { fromJS } from "immutable";

function registerCommTarget(
  state: CommsRecord,
  action: RegisterCommTargetAction
): CommsRecord {
  return state.setIn(["targets", action.name], action.handler);
}

function processCommOpen(
  state: CommsRecord,
  action: CommOpenAction
): CommsRecord {
  const { target_name, target_module, data, comm_id } = action;

  const commInfo = {
    target_module,
    target_name
  };

  return state
    .setIn(["info", comm_id], fromJS(commInfo))
    .setIn(["models", comm_id], fromJS(data));
}

function processCommMessage(
  state: CommsRecord,
  action: CommMessageAction
): CommsRecord {
  const { data, comm_id } = action;

  const commInfo = state.getIn(["info", comm_id]);
  if (
    commInfo &&
    commInfo.get("target_module") === "reducers" &&
    commInfo.get("target_name") === "setIn"
  ) {
    const path: Array<string | number> = data.path;
    const value = fromJS(data.value);

    // set `value` into `path` of the model data
    return state.updateIn(["models", comm_id], model =>
      model.setIn(path, value)
    );
  }

  // Default to overwrite / replace for now
  return state.setIn(["models", comm_id], fromJS(data));
}

type CommAction = RegisterCommTargetAction | CommMessageAction | CommOpenAction;

export default function(
  state: CommsRecord = makeCommsRecord(),
  action: CommAction
): CommsRecord {
  switch (action.type) {
    case "REGISTER_COMM_TARGET":
      return registerCommTarget(state, action);
    case "COMM_OPEN":
      return processCommOpen(state, action);
    case "COMM_MESSAGE":
      return processCommMessage(state, action);
    default:
      return state;
  }
}
