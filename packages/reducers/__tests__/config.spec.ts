import { Map } from "immutable";

import * as actionTypes from "@nteract/actions";
import reducers from "../src/config";

describe("setKey", () => {
  test("sets the keys in the config", () => {
    const initialState = Map({ theme: null });

    const state = reducers(initialState, {
      type: actionTypes.SET_CONFIG_AT_KEY,
      key: "theme",
      value: "daf"
    });
    expect(state.get("theme")).toBe("daf");
  });
});

describe("mergeConfig", () => {
  test("sets the config", () => {
    const initialState = Map({});

    const config = { theme: "dark" };
    const state = reducers(initialState, {
      type: actionTypes.MERGE_CONFIG,
      config
    });
    expect(state.get("theme")).toBe("dark");
  });
});
