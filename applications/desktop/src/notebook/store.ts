import { middlewares as coreMiddlewares, reducers } from "@nteract/core";
import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { combineEpics, createEpicMiddleware } from "redux-observable";

import { Actions } from "./actions";
import epics from "./epics";
import { handleDesktopNotebook } from "./reducers";
import { DesktopNotebookAppState } from "./state";

const rootEpic = combineEpics(...epics);
const epicMiddleware = createEpicMiddleware<
  Actions,
  Actions,
  DesktopNotebookAppState,
  any
>();
const middlewares = [epicMiddleware, coreMiddlewares.errorMiddleware];

export type DesktopStore = Store<DesktopNotebookAppState, Actions>;

if (process.env.DEBUG === "true") {
  middlewares.push(coreMiddlewares.logger());
}

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  desktopNotebook: handleDesktopNotebook
});

export default function configureStore(
  initialState: Partial<DesktopNotebookAppState>
): DesktopStore {
  const store = createStore(
    rootReducer,
    (initialState as unknown) as any,
    applyMiddleware(...middlewares)
  );
  epicMiddleware.run(rootEpic);
  return store as DesktopStore;
}
