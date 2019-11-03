import {
  ContentRef,
  HostRef,
  KernelspecProps,
  KernelspecsRef
} from "@nteract/types";

import * as actionTypes from "../actionTypes";

export const fetchKernelspecs = (payload: {
  kernelspecsRef: KernelspecsRef;
  hostRef: HostRef;
}): actionTypes.FetchKernelspecs => ({
  type: actionTypes.FETCH_KERNELSPECS,
  payload
});

export const fetchKernelspecsFulfilled = (payload: {
  kernelspecsRef: KernelspecsRef;
  hostRef: HostRef;
  defaultKernelName: string;
  kernelspecs: { [kernelspec: string]: KernelspecProps };
}): actionTypes.FetchKernelspecsFulfilled => ({
  type: actionTypes.FETCH_KERNELSPECS_FULFILLED,
  payload
});

export const fetchKernelspecsFailed = (payload: {
  kernelspecsRef: KernelspecsRef;
  error: object;
}): actionTypes.FetchKernelspecsFailed => ({
  type: actionTypes.FETCH_KERNELSPECS_FAILED,
  payload
});

// "legacy" action that pushes kernelspec info back up
// for the notebook document
export function setKernelspecInfo(payload: {
  kernelInfo: any;
  contentRef: ContentRef;
}): actionTypes.SetKernelspecInfo {
  return {
    type: actionTypes.SET_KERNELSPEC_INFO,
    payload
  };
}
