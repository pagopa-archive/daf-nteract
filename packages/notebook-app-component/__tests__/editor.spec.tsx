import { actions, ContentModel } from "@nteract/core";
import { fixtureStore } from "@nteract/fixtures";
import { mount } from "enzyme";
import React from "react";
import { Provider } from "react-redux";

import Editor from "../src/editor";

describe("EditorProvider", () => {
  const store = fixtureStore({});

  const state = store.getState();
  const contentRef = state.core.entities.contents.byRef.keySeq().first();

  const content = state.core.entities.contents.byRef.get(contentRef);
  if (!content) {
    throw new Error("Content not set up properly for test");
  }
  const model: ContentModel = content.model;
  if (model.type !== "notebook") {
    throw new Error("Content not set up properly for test");
  }

  const id: string = model.notebook.cellOrder.first();

  const setup = (cellFocused = true) =>
    mount(
      <Provider store={store}>
        <Editor
          contentRef={contentRef}
          id={id}
          focusAbove={jest.fn()}
          focusBelow={jest.fn()}
        />
      </Provider>
    );

  test("can be constructed", () => {
    const component = setup();
    expect(component).not.toBeNull();
  });
  test("onChange updates cell source", () =>
    new Promise(resolve => {
      const dispatch = action => {
        expect(action.payload.id).toBe(id);
        expect(action.payload.value).toBe("i love nteract");
        expect(action.type).toBe(actions.SET_IN_CELL);
        resolve();
      };
      store.dispatch = dispatch as any;
      const wrapper = setup();
      const onChange = wrapper
        .findWhere(n => n.prop("onChange") !== undefined)
        .first()
        .prop("onChange");
      onChange("i love nteract");
    }));
  test("onFocusChange can update editor focus", () =>
    new Promise(resolve => {
      const dispatch = action => {
        expect(action.payload.id).toBe(id);
        expect(action.type).toBe(actions.FOCUS_CELL_EDITOR);
        resolve();
      };
      store.dispatch = dispatch;
      const wrapper = setup();
      const onFocusChange = wrapper
        .findWhere(n => n.prop("onFocusChange") !== undefined)
        .first()
        .prop("onFocusChange");
      onFocusChange(true);
    }));
});
