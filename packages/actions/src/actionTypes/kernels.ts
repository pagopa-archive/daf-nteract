import { CellId } from "@nteract/commutable";
import { ExecuteRequest } from "@nteract/messaging";
import {
  ContentRef,
  KernelInfo,
  KernelRef,
  KernelspecInfo,
  LocalKernelProps,
  RemoteKernelProps
} from "@nteract/types";

export const SEND_EXECUTE_REQUEST = "SEND_EXECUTE_REQUEST";
export interface SendExecuteRequest {
  type: "SEND_EXECUTE_REQUEST";
  payload: {
    id: CellId;
    message: ExecuteRequest;
    contentRef: ContentRef;
  };
}

export const EXECUTE_CELL = "EXECUTE_CELL";
export interface ExecuteCell {
  type: "EXECUTE_CELL";
  payload: {
    id: CellId;
    contentRef: ContentRef;
  };
}

export const EXECUTE_ALL_CELLS = "EXECUTE_ALL_CELLS";
export interface ExecuteAllCells {
  type: "EXECUTE_ALL_CELLS";
  payload: {
    contentRef: ContentRef;
  };
}

export const EXECUTE_ALL_CELLS_BELOW = "EXECUTE_ALL_CELLS_BELOW";
export interface ExecuteAllCellsBelow {
  type: "EXECUTE_ALL_CELLS_BELOW";
  payload: {
    contentRef: ContentRef;
  };
}

export const EXECUTE_FOCUSED_CELL = "EXECUTE_FOCUSED_CELL";
export interface ExecuteFocusedCell {
  type: "EXECUTE_FOCUSED_CELL";
  payload: {
    contentRef: ContentRef;
  };
}

export const EXECUTE_CANCELED = "EXECUTE_CANCELED";
export interface ExecuteCanceled {
  type: "EXECUTE_CANCELED";
  payload: {
    id: CellId;
    contentRef: ContentRef;
  };
}

export const EXECUTE_FAILED = "EXECUTE_FAILED";
export interface ExecuteFailed {
  type: "EXECUTE_FAILED";
  payload: {
    error: Error;
    contentRef?: ContentRef;
  };
  error: true;
}

export const SET_KERNEL_INFO = "CORE/SET_KERNEL_INFO";
export interface SetKernelInfo {
  type: "CORE/SET_KERNEL_INFO";
  payload: {
    kernelRef: KernelRef;
    info: KernelInfo;
  };
}

export const INTERRUPT_KERNEL = "INTERRUPT_KERNEL";
export interface InterruptKernel {
  type: "INTERRUPT_KERNEL";
  payload: {
    kernelRef?: KernelRef | null;
    contentRef?: ContentRef | null;
  };
}

export const INTERRUPT_KERNEL_SUCCESSFUL = "INTERRUPT_KERNEL_SUCCESSFUL";
export interface InterruptKernelSuccessful {
  type: "INTERRUPT_KERNEL_SUCCESSFUL";
  payload: {
    kernelRef?: KernelRef | null;
  };
}

export const INTERRUPT_KERNEL_FAILED = "INTERRUPT_KERNEL_FAILED";
export interface InterruptKernelFailed {
  type: "INTERRUPT_KERNEL_FAILED";
  payload: {
    error: Error;
    kernelRef?: KernelRef | null;
  };
  error: true;
}

export const KILL_KERNEL = "KILL_KERNEL";
export interface KillKernelAction {
  type: "KILL_KERNEL";
  payload: {
    restarting: boolean;
    kernelRef?: KernelRef | null;
    contentRef?: ContentRef | null;
  };
}

export const KILL_KERNEL_FAILED = "KILL_KERNEL_FAILED";
export interface KillKernelFailed {
  type: "KILL_KERNEL_FAILED";
  payload: {
    error: Error;
    kernelRef?: KernelRef | null;
  };
  error: true;
}

export const KILL_KERNEL_SUCCESSFUL = "KILL_KERNEL_SUCCESSFUL";
export interface KillKernelSuccessful {
  type: "KILL_KERNEL_SUCCESSFUL";
  payload: {
    kernelRef?: KernelRef | null;
  };
}

export const RESTART_KERNEL = "RESTART_KERNEL";
export type RestartKernelOutputHandling = "None" | "Clear All" | "Run All";
export interface RestartKernel {
  type: "RESTART_KERNEL";
  payload: {
    outputHandling: RestartKernelOutputHandling;
    kernelRef?: KernelRef | null;
    contentRef: ContentRef;
  };
}

export const RESTART_KERNEL_FAILED = "RESTART_KERNEL_FAILED";
export interface RestartKernelFailed {
  type: "RESTART_KERNEL_FAILED";
  payload: {
    error: Error;
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
  error: true;
}

export const RESTART_KERNEL_SUCCESSFUL = "RESTART_KERNEL_SUCCESSFUL";
export interface RestartKernelSuccessful {
  type: "RESTART_KERNEL_SUCCESSFUL";
  payload: {
    kernelRef: KernelRef;
    contentRef: ContentRef;
  };
}

export const LAUNCH_KERNEL = "LAUNCH_KERNEL";
export interface LaunchKernelAction {
  type: "LAUNCH_KERNEL";
  payload: {
    kernelRef: KernelRef;
    kernelSpec: KernelspecInfo;
    cwd: string;
    selectNextKernel: boolean;
    contentRef: ContentRef;
  };
}

export const CHANGE_KERNEL_BY_NAME = "CHANGE_KERNEL_BY_NAME";
export interface ChangeKernelByName {
  type: "CHANGE_KERNEL_BY_NAME";
  payload: {
    kernelSpecName: string;
    oldKernelRef?: KernelRef | null;
    contentRef: ContentRef;
  };
}

export const LAUNCH_KERNEL_BY_NAME = "LAUNCH_KERNEL_BY_NAME";
export interface LaunchKernelByNameAction {
  type: "LAUNCH_KERNEL_BY_NAME";
  payload: {
    kernelSpecName: string;
    cwd: string;
    kernelRef: KernelRef;
    selectNextKernel: boolean;
    contentRef: ContentRef;
  };
}

export const LAUNCH_KERNEL_FAILED = "LAUNCH_KERNEL_FAILED";
export interface LaunchKernelFailed {
  type: "LAUNCH_KERNEL_FAILED";
  payload: {
    error: Error;
    kernelRef?: KernelRef;
    contentRef?: ContentRef;
  };
  error: true;
}

export const LAUNCH_KERNEL_SUCCESSFUL = "LAUNCH_KERNEL_SUCCESSFUL";
export interface NewKernelAction {
  type: "LAUNCH_KERNEL_SUCCESSFUL";
  payload: {
    kernel: LocalKernelProps | RemoteKernelProps;
    kernelRef: KernelRef;
    contentRef: ContentRef;
    selectNextKernel: boolean;
  };
}

export const KERNEL_RAW_STDOUT = "KERNEL_RAW_STDOUT";
export interface KernelRawStdout {
  type: "KERNEL_RAW_STDOUT";
  payload: {
    kernelRef: KernelRef;
    text: string;
  };
}

export const KERNEL_RAW_STDERR = "KERNEL_RAW_STDERR";
export interface KernelRawStderr {
  type: "KERNEL_RAW_STDERR";
  payload: {
    kernelRef: KernelRef;
    text: string;
  };
}

export const DELETE_CONNECTION_FILE_FAILED = "DELETE_CONNECTION_FILE_FAILED";
export interface DeleteConnectionFileFailedAction {
  type: "DELETE_CONNECTION_FILE_FAILED";
  payload: {
    error: Error;
    kernelRef: KernelRef;
  };
  error: true;
}

export const DELETE_CONNECTION_FILE_SUCCESSFUL =
  "DELETE_CONNECTION_FILE_SUCCESSFUL";
export interface DeleteConnectionFileSuccessfulAction {
  type: "DELETE_CONNECTION_FILE_SUCCESSFUL";
  payload: {
    kernelRef: KernelRef;
  };
}

export const SHUTDOWN_REPLY_SUCCEEDED = "SHUTDOWN_REPLY_SUCCEEDED";
export interface ShutdownReplySucceeded {
  type: "SHUTDOWN_REPLY_SUCCEEDED";
  payload: {
    content: { restart: boolean };
    kernelRef: KernelRef;
  };
}

export const SHUTDOWN_REPLY_TIMED_OUT = "SHUTDOWN_REPLY_TIMED_OUT";
export interface ShutdownReplyTimedOut {
  type: "SHUTDOWN_REPLY_TIMED_OUT";
  payload: {
    error: Error;
    kernelRef: KernelRef;
  };
  error: true;
}
