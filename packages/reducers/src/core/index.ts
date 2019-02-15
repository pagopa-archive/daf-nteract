import { Action } from "redux";
import { combineReducers } from "redux-immutable";

import * as actions from "@nteract/actions";

import { makeStateRecord } from "@nteract/types";

import { entities } from "./entities";

// TODO: #2618: This should at a minimum be moved into a contents entry.
// TODO: This is temporary until we have sessions in place. Ideally, we point to
// a document, which knows about its session and that session knows about its
// kernel. For now, we need to keep a reference to the currently targeted kernel
// around.
const kernelRef = (state = "", action: Action) => {
  let typedAction;
  switch (action.type) {
    case actions.LAUNCH_KERNEL:
    case actions.LAUNCH_KERNEL_BY_NAME:
      typedAction = action as actions.LaunchKernelAction;
      return typedAction.payload.selectNextKernel
        ? typedAction.payload.kernelRef
        : state;
    case actions.LAUNCH_KERNEL_SUCCESSFUL:
      typedAction = action as actions.NewKernelAction;
      return typedAction.payload.selectNextKernel
        ? typedAction.payload.kernelRef
        : state;
    default:
      return state;
  }
};

const currentKernelspecsRef = (state = "", action: Action) => {
  switch (action.type) {
    case actions.FETCH_KERNELSPECS:
      const typedAction = action as actions.FetchKernelspecs;
      return typedAction.payload.kernelspecsRef;
    default:
      return state;
  }
};

const core = combineReducers(
  {
    currentKernelspecsRef,
    entities,
    kernelRef
  },
  makeStateRecord as any
);

export default core;
