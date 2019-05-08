import { WidgetDisplay } from "@nteract/jupyter-widgets";
import * as React from "react";
import * as renderer from "react-test-renderer";
import { Subject } from "rxjs";

describe("index", () => {
  describe("WidgetDisplay", () => {
    /**
     * Tests that the component can be constructed.
     */
    it("can be constructed", () => {
      expect(
        <WidgetDisplay data={{ model_id: "none" }} channels={new Subject()} />
      ).not.toBeNull();
    });

    /**
     * Tests that the component can be rendered.
     */
    it("matches snapshot", () => {
      const renderedComponent = renderer.create(
        <WidgetDisplay data={{ model_id: "none" }} channels={new Subject()} />
      );
      expect(renderedComponent.toJSON()).toMatchSnapshot();
    });
  });
});
