import { AppState, KernelRef } from "@nteract/types";

import { createSelector } from "reselect";

/**
 * Returns a map of the available kernels keyed by the
 * kernel ref.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The kernels by ref
 */
export const kernelsByRef = (state: AppState) =>
  state.core.entities.kernels.byRef;

/**
 * Returns the kernel associated with a given KernelRef.
 *
 * @param   state                   The state of the nteract application
 * @param   { kernelRef: KernelRef} An object containing the KernelRef
 *
 * @returns                         The kernel for the KernelRef
 */
export const kernel = (
  state: AppState,
  { kernelRef }: { kernelRef?: KernelRef }
) => {
  return kernelRef ? kernelsByRef(state).get(kernelRef, null) : null;
};

/**
 * Returns the KernelRef for the kernel the nteract application is currently
 * connected to.
 *
 * @param   state   The state of the nteract application
 *
 * @returns         The KernelRef for the kernel
 */
export const currentKernelRef = (state: AppState) => state.core.kernelRef;

/**
 * Returns the kernelspec of the kernel that we are currently connected to.
 * Returns null if there is no kernel.
 */
export const currentKernel = createSelector(
  [currentKernelRef, kernelsByRef],
  (kernelRef, byRef) => (kernelRef ? byRef.get(kernelRef) : null)
);

/**
 * Returns the type of the kernel the nteract application is currently
 * connected to. Returns `null` if there is no kernel.
 */
export const currentKernelType = createSelector(
  currentKernel,
  kernel => {
    if (kernel && kernel.type) {
      return kernel.type;
    }
    return null;
  }
);

/**
 * Returns the state of the kernel the nteract application is currently
 * connected to. Returns "not connected" if there is no kernel.
 */
export const currentKernelStatus = createSelector(
  [currentKernel],
  kernel => {
    if (kernel && kernel.status) {
      return kernel.status;
    }
    return "not connected";
  }
);
