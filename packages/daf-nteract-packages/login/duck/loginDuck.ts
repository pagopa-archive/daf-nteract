import { fromJS, Map } from "immutable";
import { of } from "rxjs";
import {
  map,
  take,
  catchError,
  concatMap,
  mergeMap,
  tap
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";
import { actions as nteractActions } from "@nteract/core";

const { fetchContent, fetchKernelspecs } = nteractActions;

const appName = "nteract-daf";
const reducerName = "loggedUser";
const actionDomain = appName + "/" + reducerName + "/";

// actionTypes
const LOGIN_INIT = actionDomain + "INIT";
const LOGIN_REQUEST = actionDomain + "REQUEST";
const LOGIN_FULFILL = actionDomain + "FULFILL";
const LOGIN_REJECT = actionDomain + "REJECT";
const LOGIN_RESET = actionDomain + "RESET";

const loggedUserTypes = {
  LOGIN_INIT,
  LOGIN_REQUEST,
  LOGIN_FULFILL,
  LOGIN_REJECT,
  LOGIN_RESET
};

// reducer
const loggedUserInitialState = Map({
  data: Map({ token: "" }),
  meta: Map({ error: false, isLoading: false, hasLoaded: false })
});

const loggedUser = (
  state = loggedUserInitialState,
  { type, payload, error, meta }
) =>
  ({
    [LOGIN_INIT]: loggedUserInitialState,

    [LOGIN_REQUEST]: loggedUserInitialState,

    [LOGIN_FULFILL]: Map({
      data: fromJS(payload),
      meta: Map({ ...meta, error: false })
    }),

    [LOGIN_REJECT]: Map({
      data: fromJS(payload),
      meta: Map({ ...meta, error })
    }),

    [LOGIN_RESET]: loggedUserInitialState
  }[type] || state);

// actionCreators
const initializeLogin = payload => ({
  type: LOGIN_INIT,
  payload: payload
});

const requestLogin = payload => ({
  type: LOGIN_REQUEST,
  payload: payload,
  meta: { isLoading: true, hasLoaded: false }
});

const fulfillLogin = response => ({
  type: LOGIN_FULFILL,
  payload: response,
  meta: { isLoading: false, hasLoaded: true }
});

const rejectLogin = error => ({
  type: LOGIN_REJECT,
  payload: error,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
});

const resetLogin = () => ({
  type: LOGIN_RESET
});

const loggedUserActions = {
  initializeLogin,
  requestLogin,
  fulfillLogin,
  rejectLogin,
  resetLogin
};

// selectors
// const loggedUserDataSelector = createSelector(
//   state => state["daf"][reducerName],
//   loggedUser => loggedUser.get("data").toJS()
// );

const loggedUserMetaSelector = createSelector(
  state => state["daf"][reducerName],
  loggedUser => loggedUser.get("meta").toJS()
);

// const loggedUserSelector = createSelector(
//   [loggedUserDataSelector, loggedUserMetaSelector],
//   (loggedUser, meta) => ({ loggedUser, ...meta })
// );

const loggedUserSelectors = {
  // loggedUserDataSelector,
  loggedUserMetaSelector /* ,
  loggedUserSelector */
};

// epics
const loginEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_INIT),
    concatMap(({ payload }) =>
      action$.pipe(
        ofType(LOGIN_FULFILL),
        take(1),
        mergeMap(() =>
          of(
            fetchKernelspecs(payload.fetchKernelspecs),
            fetchContent(payload.fetchContent)
          )
        )
      )
    )
  );

const requestLoginEpic = action$ => {
  const commonURL = "https://api.daf.teamdigitale.it/security-manager/v1/";
  return action$.pipe(
    ofType(LOGIN_REQUEST),
    concatMap(({ payload: { username, password } }) =>
      ajax
        .get(commonURL + "token", {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(username + ":" + password)
        })
        .pipe(
          map(({ response }) => response),
          catchError(error => of(rejectLogin(error))),
          concatMap(token =>
            ajax
              .get(commonURL + "ipa/userbymail/" + username, {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
              })
              .pipe(
                map(({ response }) => ({ token, ...response })),
                map(mappedResponse => fulfillLogin(mappedResponse)),
                catchError(error => of(rejectLogin(error)))
              )
          )
        )
    )
  );
};

const logoutEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_RESET),
    take(1),
    tap(() => window.location.reload(true))
  );

const loggedUserOperations = { loginEpic, requestLoginEpic, logoutEpic };

export {
  LOGIN_REQUEST,
  LOGIN_FULFILL,
  LOGIN_REJECT,
  LOGIN_RESET,
  loggedUserTypes,
  requestLogin,
  fulfillLogin,
  rejectLogin,
  resetLogin,
  loggedUserActions,
  // loggedUserSelector,
  // loggedUserDataSelector,
  loggedUserMetaSelector,
  loggedUserSelectors,
  loginEpic,
  loggedUserOperations,
  loggedUserInitialState,
  reducerName,
  actionDomain
};

export default loggedUser;
