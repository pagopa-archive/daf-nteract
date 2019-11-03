import {
  ContentRef,
  KernelInfo,
  KernelRef,
  LocalKernelProps,
  RemoteKernelProps
} from "@nteract/types";

import { ExecuteRequest } from "@nteract/messaging";
import * as actionTypes from "../actionTypes";

export function launchKernelFailed(payload: {
  error: Error;
  kernelRef?: KernelRef;
  contentRef?: ContentRef;
}): actionTypes.LaunchKernelFailed {
  return {
    type: actionTypes.LAUNCH_KERNEL_FAILED,
    payload,
    error: true
  };
}

export function launchKernelSuccessful(payload: {
  kernel: LocalKernelProps | RemoteKernelProps;
  kernelRef: KernelRef;
  contentRef: ContentRef;
  selectNextKernel: boolean;
}): actionTypes.NewKernelAction {
  return {
    type: actionTypes.LAUNCH_KERNEL_SUCCESSFUL,
    payload
  };
}

export function launchKernel(payload: {
  kernelSpec: any;
  cwd: string;
  kernelRef: KernelRef;
  selectNextKernel: boolean;
  contentRef: ContentRef;
}): actionTypes.LaunchKernelAction {
  return {
    type: actionTypes.LAUNCH_KERNEL,
    payload
  };
}

export function changeKernelByName(payload: {
  kernelSpecName: any;
  oldKernelRef?: KernelRef | null;
  contentRef: ContentRef;
}): actionTypes.ChangeKernelByName {
  return {
    type: actionTypes.CHANGE_KERNEL_BY_NAME,
    payload
  };
}

export function launchKernelByName(payload: {
  kernelSpecName: any;
  cwd: string;
  kernelRef: KernelRef;
  selectNextKernel: boolean;
  contentRef: ContentRef;
}): actionTypes.LaunchKernelByNameAction {
  return {
    type: actionTypes.LAUNCH_KERNEL_BY_NAME,
    payload
  };
}

export function kernelRawStdout(payload: {
  text: string;
  kernelRef: KernelRef;
}): actionTypes.KernelRawStdout {
  return {
    type: actionTypes.KERNEL_RAW_STDOUT,
    payload
  };
}

export function kernelRawStderr(payload: {
  text: string;
  kernelRef: KernelRef;
}): actionTypes.KernelRawStderr {
  return {
    type: actionTypes.KERNEL_RAW_STDERR,
    payload
  };
}

export function killKernel(payload: actionTypes.KillKernelAction["payload"]): actionTypes.KillKernelAction {
  return {
    type: actionTypes.KILL_KERNEL,
    payload
  };
}

export function killKernelFailed(payload: {
  error: Error;
  kernelRef?: KernelRef | null;
}): actionTypes.KillKernelFailed {
  return {
    type: actionTypes.KILL_KERNEL_FAILED,
    payload,
    error: true
  };
}

export function killKernelSuccessful(payload: {
  kernelRef?: KernelRef | null;
}): actionTypes.KillKernelSuccessful {
  return {
    type: actionTypes.KILL_KERNEL_SUCCESSFUL,
    payload
  };
}

export function interruptKernel(
  payload: actionTypes.InterruptKernel["payload"]
): actionTypes.InterruptKernel {
  return {
    type: actionTypes.INTERRUPT_KERNEL,
    payload
  };
}

export function interruptKernelSuccessful(payload: {
  kernelRef?: KernelRef | null;
}): actionTypes.InterruptKernelSuccessful {
  return {
    type: actionTypes.INTERRUPT_KERNEL_SUCCESSFUL,
    payload
  };
}

export function interruptKernelFailed(payload: {
  error: Error;
  kernelRef?: KernelRef | null;
}): actionTypes.InterruptKernelFailed {
  return {
    type: actionTypes.INTERRUPT_KERNEL_FAILED,
    payload,
    error: true
  };
}

export function restartKernel(payload: actionTypes.RestartKernel["payload"]): actionTypes.RestartKernel {
  return {
    type: actionTypes.RESTART_KERNEL,
    payload
  };
}

export function restartKernelFailed(payload: {
  error: Error;
  kernelRef: KernelRef;
  contentRef: ContentRef;
}): actionTypes.RestartKernelFailed {
  return {
    type: actionTypes.RESTART_KERNEL_FAILED,
    payload,
    error: true
  };
}

export function restartKernelSuccessful(payload: {
  kernelRef: KernelRef;
  contentRef: ContentRef;
}): actionTypes.RestartKernelSuccessful {
  return {
    type: actionTypes.RESTART_KERNEL_SUCCESSFUL,
    payload
  };
}

export function sendExecuteRequest(payload: {
  id: string;
  message: ExecuteRequest;
  contentRef: ContentRef;
}): actionTypes.SendExecuteRequest {
  return {
    type: actionTypes.SEND_EXECUTE_REQUEST,
    payload
  };
}
export function executeCell(payload: {
  id: string;
  contentRef: ContentRef;
}): actionTypes.ExecuteCell {
  return {
    type: actionTypes.EXECUTE_CELL,
    payload
  };
}

export function executeAllCells(payload: {
  contentRef: ContentRef;
}): actionTypes.ExecuteAllCells {
  return {
    type: actionTypes.EXECUTE_ALL_CELLS,
    payload
  };
}

export function executeAllCellsBelow(payload: {
  contentRef: ContentRef;
}): actionTypes.ExecuteAllCellsBelow {
  return {
    type: actionTypes.EXECUTE_ALL_CELLS_BELOW,
    payload
  };
}

export function executeFocusedCell(payload: {
  contentRef: ContentRef;
}): actionTypes.ExecuteFocusedCell {
  return {
    type: actionTypes.EXECUTE_FOCUSED_CELL,
    payload
  };
}

export function executeCanceled(payload: {
  id: string;
  contentRef: ContentRef;
}): actionTypes.ExecuteCanceled {
  return {
    type: actionTypes.EXECUTE_CANCELED,
    payload
  };
}

export function executeFailed(payload: {
  error: Error;
  contentRef?: ContentRef;
}): actionTypes.ExecuteFailed {
  return {
    type: actionTypes.EXECUTE_FAILED,
    error: true,
    payload
  };
}

export function deleteConnectionFileFailed(payload: {
  error: Error;
  kernelRef: KernelRef;
}): actionTypes.DeleteConnectionFileFailedAction {
  return {
    type: actionTypes.DELETE_CONNECTION_FILE_FAILED,
    payload,
    error: true
  };
}

export function deleteConnectionFileSuccessful(payload: {
  kernelRef: KernelRef;
}): actionTypes.DeleteConnectionFileSuccessfulAction {
  return {
    type: actionTypes.DELETE_CONNECTION_FILE_SUCCESSFUL,
    payload
  };
}

export function shutdownReplySucceeded(payload: {
  content: { restart: boolean };
  kernelRef: KernelRef;
}): actionTypes.ShutdownReplySucceeded {
  return {
    type: actionTypes.SHUTDOWN_REPLY_SUCCEEDED,
    payload
  };
}

export function shutdownReplyTimedOut(payload: {
  error: Error;
  kernelRef: KernelRef;
}): actionTypes.ShutdownReplyTimedOut {
  return {
    type: actionTypes.SHUTDOWN_REPLY_TIMED_OUT,
    payload,
    error: true
  };
}

export function setKernelInfo(payload: {
  kernelRef: KernelRef;
  info: KernelInfo;
}): actionTypes.SetKernelInfo {
  return {
    type: actionTypes.SET_KERNEL_INFO,
    payload
  };
}
