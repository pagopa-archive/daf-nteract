import * as React from "react";

import Manager from "../../src/manager/index";

describe("Manager", () => {
  it("can be rendered", () => {
    expect(<Manager />).not.toBeNull();
  });
});
