import * as actions from "@nteract/actions";
import { SetAppHostAction } from "@nteract/actions";
import * as stateModule from "@nteract/types";
import { makeJupyterHostRecord, makeLocalHostRecord } from "@nteract/types";
import * as reducers from "../src";

describe("save", () => {
  test("should set isSaving to true", () => {
    const originalState = stateModule.makeAppRecord({
      isSaving: false,
      kernel: stateModule.makeLocalKernelRecord({
        channels: false,
        spawn: false,
        connectionFile: false
      })
    });
    const state = reducers.app(originalState, actions.save({}));
    expect(state.isSaving).toBe(true);
  });
});

describe("saveFailed", () => {
  test("should set isSaving to false", () => {
    const originalState = stateModule.makeAppRecord({
      isSaving: true
    });

    const state = reducers.app(originalState, actions.saveFailed({}));
    expect(state.isSaving).toBe(false);
  });
});

describe("saveFulfilled", () => {
  test("should set isSaving to false", () => {
    const originalState = stateModule.makeAppRecord({
      isSaving: true
    });

    const state = reducers.app(originalState, actions.saveFulfilled({}));
    expect(state.isSaving).toBe(false);
  });
});

describe("setNotificationSystem", () => {
  test("returns the same originalState if notificationSystem is undefined", () => {
    const originalState = stateModule.makeAppRecord();

    const action = {
      type: actions.SET_NOTIFICATION_SYSTEM,
      payload: {}
      // Override action type to test reducer handling old behavior
    } as actions.SetNotificationSystemAction;

    const state = reducers.app(originalState, action);
    expect(state.notificationSystem).toEqual(originalState.notificationSystem);
  });
  test("sets the notificationSystem if given", () => {
    const originalState = stateModule.makeAppRecord();

    const action = {
      type: actions.SET_NOTIFICATION_SYSTEM,
      payload: {
        notificationSystem: { test: true }
      }
    };

    const state = reducers.app(originalState, (action as unknown) as any);
    expect(state.notificationSystem).toBe(action.payload.notificationSystem);
  });
});

describe("setGithubToken", () => {
  test("calls setGithubToken", () => {
    const originalState = stateModule.makeAppRecord({
      githubToken: null
    });

    const action = {
      type: actions.SET_GITHUB_TOKEN,
      payload: { githubToken: "TOKEN" }
    };

    const state = reducers.app(originalState, (action as unknown) as any);
    expect(state.githubToken).toBe("TOKEN");
  });
});

describe("setAppHost", () => {
  test("can set local record", () => {
    const originalState = stateModule.makeAppRecord({
      host: null
    });

    const action: SetAppHostAction = {
      type: actions.SET_APP_HOST,
      payload: makeLocalHostRecord({ id: "anid" })
    };

    const state = reducers.app(originalState, action);
    expect(state.host.get("type")).toBe("local");
    expect(state.host.get("id")).toBe("anid");
  });

  test("can set Jupyter record", () => {
    const originalState = stateModule.makeAppRecord({
      host: null
    });

    const action: SetAppHostAction = {
      type: actions.SET_APP_HOST,
      payload: makeJupyterHostRecord({ id: "anotherid" })
    };

    const state = reducers.app(originalState, action);
    expect(state.host.get("type")).toBe("jupyter");
    expect(state.host.get("id")).toBe("anotherid");
  });
});
