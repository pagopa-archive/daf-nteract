import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { displayOrder, transforms } from "@nteract/transforms";

import { fixtureCommutable, fixtureJSON } from "@nteract/fixtures";

import NotebookPreview from "./../src";

// In order to get reproducable snapshots we need to mock the uuid package
jest.mock("uuid/v4", () => {
  let uuid = 1;
  return jest.fn(() => uuid++);
});

describe("Notebook", () => {
  it("accepts an Immutable.List of cells", () => {
    const component = shallow(
      <NotebookPreview
        notebook={fixtureCommutable}
        theme="daf"
        tip
        displayOrder={displayOrder}
        transforms={transforms}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });

  it("accepts an Object of cells", () => {
    const component = shallow(
      <NotebookPreview
        notebook={fixtureJSON}
        theme="daf"
        tip
        displayOrder={displayOrder}
        transforms={transforms}
      />
    );
    expect(toJson(component)).toMatchSnapshot();
  });
});
