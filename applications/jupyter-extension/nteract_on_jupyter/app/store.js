/* @flow strict */
import { combineReducers, createStore, applyMiddleware, compose } from "redux";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import type { AppState } from "@nteract/core";
import { reducers, epics as coreEpics, middlewares as coreMiddlewares } from "@nteract/core";
import {
  DafAppState,
  reducers as dafReducers,
  epics as dafEpics
} from "../../../../packages/daf-packages/daf-core";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  daf: combineReducers(dafReducers)
});

export default function configureStore(initialState: DafAppState) {
  const rootEpic = combineEpics<DafAppState, redux$AnyAction, *>(
    ...coreEpics.allEpics,
    ...dafEpics.allDafEpics
  );
  const epicMiddleware = createEpicMiddleware();
  const middlewares = [
    epicMiddleware,
    coreMiddlewares.errorMiddleware,
    coreMiddlewares.logger()
  ];

  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
