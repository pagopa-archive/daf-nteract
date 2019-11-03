import uuid from "uuid/v4";

export type HostRef = string;
export type KernelRef = string;
export type KernelspecsRef = string;
export type ContentRef = string;

export function createHostRef(): HostRef {
  return uuid();
}
export function createKernelRef(): KernelRef {
  return uuid();
}
export function createKernelspecsRef(): KernelspecsRef {
  return uuid();
}
export function createContentRef(): ContentRef {
  return uuid();
}
