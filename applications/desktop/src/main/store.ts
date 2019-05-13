import { middlewares as coreMiddlewares } from "@nteract/core";
import { applyMiddleware, compose, createStore, Middleware } from "redux";

import reducers from "./reducers";

const middlewares: Middleware[] = [];

/* istanbul ignore if -- only used for debugging */
if (process.env.DEBUG === "true") {
  middlewares.push(coreMiddlewares.logger());
}

export default function configureStore() {
  return createStore(reducers, compose(applyMiddleware(...middlewares)));
}
