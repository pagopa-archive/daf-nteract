import { emptyMarkdownCell } from "@nteract/commutable";
import { shallow } from "enzyme";
import React from "react";

import DraggableCell from "../src/draggable-cell";

// Spoof DND manager for tests.
const dragDropManager = {
  getMonitor: () => ({
    subscribeToStateChange: () => {},
    isDraggingSource: () => {}
  }),
  getBackend: () => {},
  getRegistry: () => ({
    addSource: () => {},
    removeSource: () => {}
  })
};

describe("DraggableCell", () => {
  test("can be rendered", () => {
    const cell = shallow(<DraggableCell cell={emptyMarkdownCell} />, {
      context: { dragDropManager }
    });
    expect(cell).not.toBeNull();
  });
});
