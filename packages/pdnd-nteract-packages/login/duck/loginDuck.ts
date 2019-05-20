import { fromJS, Map } from "immutable";
import { of, interval } from "rxjs";
import {
  map,
  take,
  catchError,
  concatMap,
  tap
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";

const appName = "nteract-pdnd";
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
  data: Map({ bearerToken: "", basicToken: "", uid: "", roles: [] }),
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
  state => state["pdnd"][reducerName],
  loggedUser => loggedUser.get("data").toJS()
);

const usernameSelector = createSelector(
  [loggedUserDataSelector],
  ({ uid }) => ({ username: uid })
);

const tokensSelector = createSelector(
  [loggedUserDataSelector],
  ({ bearerToken, basicToken }) => ({ bearerToken, basicToken })
);

const loggedUserMetaSelector = createSelector(
  state => state["pdnd"][reducerName],
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
  tokensSelector,
  loggedUserMetaSelector,
  isUserLogged
};

// epics
const commonURL = "https://api.daf.teamdigitale.it/";

const requestUserObservable = ({ bearerToken, basicToken, username }) =>
  ajax
    .get(commonURL + "security-manager/v1/ipa/userbymail/" + username, {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + bearerToken
    })
    .pipe(
      map(({ response }) => ({ bearerToken, basicToken, ...response })),
      tap(() => {
        window.localStorage.setItem("bearerToken", bearerToken);
        window.localStorage.setItem("basicToken", basicToken);
        window.localStorage.setItem("username", username);
      }),
      map(mappedResponse => fulfillLogin(mappedResponse)),
      catchError(error => of(rejectLogin()))
    );

const loginEpic = (action$, state$) =>
  interval(5000).pipe(
    // bearerToken && validate ? fulfill : reset non working
    map(() => ({
      bearerToken: window.localStorage.getItem("bearerToken"),
      basicToken: window.localStorage.getItem("basicToken"),
      username: window.localStorage.getItem("username")
    })),
    concatMap(({ bearerToken, basicToken, username }) =>
      bearerToken && basicToken && username
        ? ajax
            .get(commonURL + "sso-manager/secured/test", {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: "Bearer " + bearerToken
            })
            .pipe(
              concatMap(() =>
                ({ ...isUserLogged(state$.value) }.isUserLogged
                  ? []
                  : requestUserObservable({
                      bearerToken,
                      basicToken,
                      username
                    }))
              ),
              catchError(error => of(resetLogin()))
            )
        : []
    )
  );

const requestLoginEpic = action$ => {
  return action$.pipe(
    ofType(LOGIN_REQUEST),
    concatMap(({ payload: { username, password } }) => {
      const basicToken = btoa(username + ":" + password);
      return ajax
        .get(commonURL + "security-manager/v1/token", {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + basicToken
        })
        .pipe(
          map(({ response }) => response),
          catchError(error => of(rejectLogin())),
          concatMap(bearerToken =>
            requestUserObservable({ bearerToken, basicToken, username })
          )
        );
    })
  );
};

const removeLocals = () => {
  window.localStorage.removeItem("bearerToken");
  window.localStorage.removeItem("basicToken");
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
  tokensSelector,
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
