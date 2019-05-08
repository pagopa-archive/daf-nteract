import { fixtureCommutable } from "@nteract/fixtures";
import { shallow } from "enzyme";
import React from "react";

import { StatusBar } from "../src/status-bar";

describe("StatusBar", () => {
  test("can render on a dummyNotebook", () => {
    const lastSaved = new Date();
    const kernelSpecDisplayName = "python3";

    const component = shallow(
      <StatusBar
        notebook={fixtureCommutable}
        lastSaved={lastSaved}
        kernelSpecDisplayName={kernelSpecDisplayName}
      />
    );

    expect(component).not.toBeNull();
  });
  test("no update if an irrelevant prop has changed", () => {
    const lastSaved = new Date();
    const kernelSpecDisplayName = "python3";

    const component = shallow(
      <StatusBar
        notebook={fixtureCommutable}
        lastSaved={lastSaved}
        kernelSpecDisplayName={kernelSpecDisplayName}
      />
    );

    const shouldUpdate = component.instance().shouldComponentUpdate({
      lastSaved,
      kernelSpecDisplayName: "javascript",
      notebook: fixtureCommutable
    });
    expect(shouldUpdate).toBe(false);
  });
  test("update if an irrelevant prop has changed", () => {
    const lastSaved = new Date();
    const kernelSpecDisplayName = "python3";

    const component = shallow(
      <StatusBar
        notebook={fixtureCommutable}
        lastSaved={lastSaved}
        kernelSpecDisplayName={kernelSpecDisplayName}
      />
    );

    const shouldUpdate = component.instance().shouldComponentUpdate({
      lastSaved: new Date(),
      kernelSpecDisplayName: "python3",
      notebook: fixtureCommutable
    });
    expect(shouldUpdate).toBe(true);
  });
});
