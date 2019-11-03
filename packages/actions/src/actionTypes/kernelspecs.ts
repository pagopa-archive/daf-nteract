import {
  ContentRef,
  HostRef,
  KernelspecInfo,
  KernelspecProps,
  KernelspecsRef
} from "@nteract/types";

export const FETCH_KERNELSPECS = "CORE/FETCH_KERNELSPECS";
export interface FetchKernelspecs {
  type: "CORE/FETCH_KERNELSPECS";
  payload: {
    kernelspecsRef: KernelspecsRef;
    hostRef: HostRef;
  };
}

export const FETCH_KERNELSPECS_FULFILLED = "CORE/FETCH_KERNELSPECS_FULFILLED";
export interface FetchKernelspecsFulfilled {
  type: "CORE/FETCH_KERNELSPECS_FULFILLED";
  payload: {
    kernelspecsRef: KernelspecsRef;
    hostRef: HostRef;
    defaultKernelName: string;
    kernelspecs: { [kernelspec: string]: KernelspecProps };
  };
}

export const FETCH_KERNELSPECS_FAILED = "CORE/FETCH_KERNELSPECS_FAILED";
export interface FetchKernelspecsFailed {
  type: "CORE/FETCH_KERNELSPECS_FAILED";
  payload: {
    kernelspecsRef: KernelspecsRef;
    error: object;
  };
}

// "legacy" action that pushes kernelspec info back up
// for the notebook document
export const SET_KERNELSPEC_INFO = "SET_KERNELSPEC_INFO";
export interface SetKernelspecInfo {
  type: "SET_KERNELSPEC_INFO";
  payload: {
    kernelInfo: KernelspecInfo;
    contentRef: ContentRef;
  };
}
