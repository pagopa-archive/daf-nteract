import React from "react";
import ReactDOMServer from "react-dom/server";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
import { displayOrder, transforms } from "@nteract/transforms";

import { fixtureCommutable, fixtureJSON } from "@nteract/fixtures";

import NotebookRender from "./../src";

// In order to get reproducable snapshots we need to mock the uuid package
jest.mock("uuid/v4", () => {
  let uuid = 1;
  return jest.fn(() => uuid++);
});

describe("Test NotebokRender snapshots", () => {
  it("accepts an Immutable.List of cells", () => {
    const component = shallow(
      <NotebookRender
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
      <NotebookRender
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

describe("Render server-side with renderToStaticMarkup", () => {
  it("html fragment shouldn't be empty", () => {
    const component = shallow(
      <NotebookRender
        notebook={fixtureJSON}
        theme="daf"
        tip
        displayOrder={displayOrder}
        transforms={transforms}
      />
    );
    const html = ReactDOMServer.renderToStaticMarkup(component);

    expect(html.length).toBeGreaterThan(0);
  });
});
