// Vendor modules
import * as actions from "@nteract/actions";
import {
  Save,
  SaveFailed,
  SaveFulfilled,
  SetAppHostAction,
  SetGithubTokenAction,
  SetNotificationSystemAction
} from "@nteract/actions";
import { AppRecord, AppRecordProps, makeAppRecord } from "@nteract/types";
import { RecordOf } from "immutable";

function setGithubToken(
  state: AppRecord,
  action: SetGithubTokenAction
): RecordOf<AppRecordProps> {
  return state.set("githubToken", action.payload.githubToken);
}

function save(state: AppRecord): RecordOf<AppRecordProps> {
  return state.set("isSaving", true);
}

function saveFailed(state: AppRecord): RecordOf<AppRecordProps> {
  return state.set("isSaving", false);
}

function saveFulfilled(state: AppRecord): RecordOf<AppRecordProps> {
  return state.set("isSaving", false).set("lastSaved", new Date());
}

function setNotificationsSystem(
  state: AppRecord,
  action: SetNotificationSystemAction
): RecordOf<AppRecordProps> {
  if (!action.payload || !action.payload.notificationSystem) {
    return state;
  }
  return state.set("notificationSystem", action.payload.notificationSystem);
}

function setAppHost(
  state: AppRecord,
  action: SetAppHostAction
): RecordOf<AppRecordProps> {
  return state.set("host", action.payload);
}

export default function handleApp(
  state: AppRecord = makeAppRecord(),
  action:
    | SetNotificationSystemAction
    | SetGithubTokenAction
    | Save
    | SaveFulfilled
    | SaveFailed
    | SetAppHostAction
): RecordOf<AppRecordProps> {
  switch (action.type) {
    case actions.SAVE:
      return save(state);
    case actions.SAVE_FAILED:
      return saveFailed(state);
    case actions.SAVE_FULFILLED:
      return saveFulfilled(state);
    case actions.SET_NOTIFICATION_SYSTEM:
      return setNotificationsSystem(state, action);
    case actions.SET_GITHUB_TOKEN:
      return setGithubToken(state, action);
    case actions.SET_APP_HOST:
      return setAppHost(state, action);
    default:
      return state;
  }
}
