import { AppState } from "@nteract/types";

/**
 * Returns the Jupyter comms data for a given nteract application.
 */
export const comms = (state: AppState) => state.comms;

/**
 * Returns the comms models that are stored in the nteract application state.
 */
export const models = (state: AppState) => state.comms.models;

/**
 * Returns the registered comm targets that are stored in the nteract application state.
 */
export const targets = (state: AppState) => state.comms.targets;

/**
 * Returns the information associated with currently registered comms.
 */
export const info = (state: AppState) => state.comms.info;

/**
 * Returns the model associated with a comm at a certain id.
 *
 * @param state The current application state
 * @param { commId }  The commId to get info for
 */
export const modelById = (state: AppState, { commId }: { commId: string }) =>
  state.comms.models.get(commId);

/**
 * Returns the handler associated with a comm target at a certain id.
 *
 * @param state The current application state
 * @param { commId }  The commId to get target for
 */
export const targetById = (state: AppState, { commId }: { commId: string }) =>
  state.comms.targets.get(commId);

/**
 * Returns the information associated with a comm registered at a certain id.
 *
 * @param state The current application state
 * @param { commId }  The commId to get info for
 */
export const infoById = (state: AppState, { commId }: { commId: string }) =>
  state.comms.info.get(commId);
