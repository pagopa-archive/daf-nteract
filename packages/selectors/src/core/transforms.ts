import { AppState } from "@nteract/types";

export const transformsById = (state: AppState) =>
  state.core.entities.transforms.byId;

export const displayOrder = (state: AppState) =>
  state.core.entities.transforms.displayOrder;

export const transform = (state: AppState, { id }: { id: string }) =>
  transformsById(state).get(id);
