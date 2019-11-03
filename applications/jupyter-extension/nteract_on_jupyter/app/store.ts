import { AppState } from "@nteract/core";
import {
  epics as coreEpics,
  middlewares as coreMiddlewares,
  reducers
} from "@nteract/core";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { combineEpics, createEpicMiddleware, Epic, ActionsObservable, StateObservable } from "redux-observable";
import {
  pdndReducers,
  pdndEpics
} from "../../../../packages/pdnd-nteract-packages/ducks";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  app: reducers.app,
  comms: reducers.comms,
  config: reducers.config,
  core: reducers.core,
  pdnd: combineReducers(pdndReducers)
});

export default function configureStore(initialState: Partial<AppState>) {
  const rootEpic = (
    action$: ActionsObservable<any>,
    store$: StateObservable<any>,
    dependencies: any
  ) =>
    combineEpics<Epic>(...coreEpics.allEpics, ...pdndEpics)(
      action$,
      store$,
      dependencies
    ).pipe(
      catchError((error: any, source: Observable<any>) => {
        console.error(error);
        return source;
      })
    );
    
  const epicMiddleware = createEpicMiddleware();
  const middlewares = [
    epicMiddleware,
    coreMiddlewares.errorMiddleware,
    coreMiddlewares.logger()
  ];

  const store = createStore(
    rootReducer,
    // TODO: Properly type redux store for jupyter-extension
    (initialState as unknown) as any,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  epicMiddleware.run(rootEpic);

  return store;
}
