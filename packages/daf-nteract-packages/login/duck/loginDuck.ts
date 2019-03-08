import { fromJS, Map } from "immutable";
import { of, interval } from "rxjs";
import {
  map,
  take,
  catchError,
  concatMap,
  tap,
  skipWhile
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";

const appName = "nteract-daf";
const reducerName = "loggedUser";
const actionDomain = appName + "/" + reducerName + "/";

// actionTypes
const LOGIN_REQUEST = actionDomain + "REQUEST";
const LOGIN_FULFILL = actionDomain + "FULFILL";
const LOGIN_REJECT = actionDomain + "REJECT";
const LOGIN_RESET = actionDomain + "RESET";

const loggedUserTypes = {
  LOGIN_REQUEST,
  LOGIN_FULFILL,
  LOGIN_REJECT,
  LOGIN_RESET
};

// reducer
const loggedUserInitialState = Map({
  data: Map({ token: "", uid: "" }),
  meta: Map({ error: false, isLoading: false, hasLoaded: false })
});

const loggedUser = (
  state = loggedUserInitialState,
  { type, payload, error, meta }
) =>
  ({
    [LOGIN_REQUEST]: loggedUserInitialState,

    [LOGIN_FULFILL]: Map({
      data: fromJS(payload),
      meta: Map({ ...meta, error: false })
    }),

    [LOGIN_REJECT]: Map({
      data: Map(),
      meta: Map({ ...meta, error })
    }),

    [LOGIN_RESET]: loggedUserInitialState
  }[type] || state);

// actionCreators
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

const rejectLogin = () => ({
  type: LOGIN_REJECT,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
});

const resetLogin = () => ({
  type: LOGIN_RESET
});

const loggedUserActions = {
  requestLogin,
  fulfillLogin,
  rejectLogin,
  resetLogin
};

// selectors
const loggedUserDataSelector = createSelector(
  state => state["daf"][reducerName],
  loggedUser => loggedUser.get("data").toJS()
);

const usernameSelector = createSelector(
  [loggedUserDataSelector],
  ({ uid }) => ({ username: uid })
);

const tokenSelector = createSelector(
  [loggedUserDataSelector],
  ({ token }) => ({ bearerToken: token })
);

const loggedUserMetaSelector = createSelector(
  state => state["daf"][reducerName],
  loggedUser => loggedUser.get("meta").toJS()
);

const isUserLogged = createSelector(
  [loggedUserMetaSelector],
  ({ isLoading, hasLoaded, error }) => ({
    isUserLogged: hasLoaded && !error && !isLoading
  })
);

// const loggedUserSelector = createSelector(
//   [loggedUserDataSelector, loggedUserMetaSelector],
//   (loggedUser, meta) => ({ loggedUser, ...meta })
// );

const loggedUserSelectors = {
  // loggedUserSelector,
  loggedUserDataSelector,
  usernameSelector,
  tokenSelector,
  loggedUserMetaSelector,
  isUserLogged
};

// epics
const commonURL = "https://api.daf.teamdigitale.it/";

const requestUserObservable = ({ token, username }) =>
  ajax
    .get(commonURL + "security-manager/v1/ipa/userbymail/" + username, {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    })
    .pipe(
      map(({ response }) => ({ token, ...response })),
      tap(() => {
        window.localStorage.setItem("bearerToken", token);
        window.localStorage.setItem("username", username);
      }),
      map(mappedResponse => fulfillLogin(mappedResponse)),
      catchError(error => of(rejectLogin()))
    );

const loginEpic = (action$, state$) =>
  interval(5000).pipe(
    // bearerToken && validate ? fulfill : reset non working
    map(() => ({
      token: window.localStorage.getItem("bearerToken"),
      username: window.localStorage.getItem("username")
    })),
    concatMap(({ token, username }) =>
      token && username
        ? ajax
            .get(commonURL + "sso-manager/secured/test", {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + token
            })
            .pipe(
              // catchError(error => of(resetLogin()))
              skipWhile(({ status }) => status !== 200),
              concatMap(() =>
                ({ ...isUserLogged(state$.value) }.isUserLogged
                  ? []
                  : requestUserObservable({ token, username }))
              )
            )
        : []
    )
  );

const requestLoginEpic = action$ => {
  return action$.pipe(
    ofType(LOGIN_REQUEST),
    concatMap(({ payload: { username, password } }) =>
      ajax
        .get(commonURL + "security-manager/v1/token", {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa(username + ":" + password)
        })
        .pipe(
          map(({ response }) => response),
          catchError(error => of(rejectLogin())),
          concatMap(token => requestUserObservable({ token, username }))
        )
    )
  );
};

const removeLocals = () => {
  window.localStorage.removeItem("bearerToken");
  window.localStorage.removeItem("username");
};

const rejectLoginEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_REJECT),
    take(1),
    tap(() => removeLocals())
  );

const logoutEpic = action$ =>
  action$.pipe(
    ofType(LOGIN_RESET),
    take(1),
    tap(() => {
      removeLocals();
      window.location.reload(true);
    })
  );

const loggedUserOperations = {
  loginEpic,
  requestLoginEpic,
  rejectLoginEpic,
  logoutEpic
};

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
  loggedUserDataSelector,
  usernameSelector,
  tokenSelector,
  loggedUserMetaSelector,
  isUserLogged,
  loggedUserSelectors,
  loginEpic,
  requestLoginEpic,
  rejectLoginEpic,
  logoutEpic,
  loggedUserOperations,
  loggedUserInitialState,
  reducerName,
  actionDomain
};

export default loggedUser;
