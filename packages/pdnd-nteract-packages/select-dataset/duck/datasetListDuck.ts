import { fromJS, Map as ImmutableMap, List as ImmutableList } from "immutable";
import { of } from "rxjs";
import {
  map,
  take,
  switchMap,
  catchError,
  concatMap,
  debounceTime
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";

import { SET_IN_CELL } from "@nteract/actions/src";
import { DATASET_FULFILL } from "./selectedDatasetDuck";
import { apiUriConfig } from "../../ducks";

const { BASE_API_URI } = apiUriConfig;

const appName = "nteract-pdnd";
const reducerName = "datasetList";
const actionDomain = appName + "/" + reducerName + "/";

// actionTypes
const DATASETLIST_REQUEST = actionDomain + "REQUEST";
const DATASETLIST_FULFILL = actionDomain + "FULFILL";
const DATASETLIST_REJECT = actionDomain + "REJECT";
const DATASETLIST_RESET = actionDomain + "RESET";

const datasetListTypes = {
  DATASETLIST_REQUEST,
  DATASETLIST_FULFILL,
  DATASETLIST_REJECT,
  DATASETLIST_RESET
};

// reducer
const datasetListInitialState = ImmutableMap({
  //Suggested fromJS()
  data: ImmutableList(),
  meta: ImmutableMap({ error: false, isLoading: false, hasLoaded: false })
});

const datasetList = (
  state = datasetListInitialState,
  { type, payload, error, meta }
) =>
  ({
    [DATASETLIST_REQUEST]: datasetListInitialState,

    [DATASETLIST_FULFILL]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error: false })
    }),

    [DATASETLIST_REJECT]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error })
    }),

    [DATASETLIST_RESET]: datasetListInitialState
  }[type] || state);

// actionCreators
const requestDatasetList = (payload = "") => ({
  type: DATASETLIST_REQUEST,
  payload: payload,
  meta: { isLoading: true, hasLoaded: false }
});

const fulfillDatasetList = response => ({
  type: DATASETLIST_FULFILL,
  payload: response,
  meta: { isLoading: false, hasLoaded: true }
});

const rejectDatasetList = error => ({
  type: DATASETLIST_REJECT,
  payload: error,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
});

const resetDatasetList = () => ({
  type: DATASETLIST_RESET
});

const datasetListActions = {
  requestDatasetList,
  fulfillDatasetList,
  rejectDatasetList,
  resetDatasetList
};

// selectors
const datasetListDataSelector = createSelector(
  state => state["pdnd"][reducerName],
  datasetList =>
    datasetList
      .get("data")
      .map(datasetEntry => datasetEntry.get("dcatapit"))
      .toJS()
);

const datasetListMetaSelector = createSelector(
  state => state["pdnd"][reducerName],
  datasetList => datasetList.get("meta").toJS()
);

const datasetListSelector = createSelector(
  [datasetListDataSelector, datasetListMetaSelector],
  (datasetList, meta) => ({ datasetList, ...meta })
);

const datasetListSelectors = {
  datasetListDataSelector,
  datasetListMetaSelector,
  datasetListSelector
};

// epics
const datasetListEpic = action$ => action$.pipe(
    debounceTime(900),
    ofType(DATASETLIST_REQUEST),
    switchMap(({ payload }) =>
      ajax
        .post(
          BASE_API_URI + "dati-gov/v1/public/elasticsearch/search",
          JSON.stringify({
            text: payload,
            index: ["catalog_test"],
            org: [],
            theme: [],
            date: "",
            status: [],
            order: "score",
            limit: 0
          }),
          {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        )
        .pipe(
          map(({ response }) =>
            response
              .filter(({ type }) => type === "catalog_test")
              .map(({ source }) => ({
                dcatapit: JSON.parse(source).dcatapit
              }))
          ),
          map(mappedResponse => fulfillDatasetList(mappedResponse)),
          catchError(error => of(rejectDatasetList(error)))
        )
    )
  );

const resetDatasetListEpic = action$ =>
  action$.pipe(
    ofType(DATASET_FULFILL),
    concatMap(
      action =>
        action$.pipe(
          ofType(SET_IN_CELL),
          take(1)
        ),
      (outerVal, innerVal) => resetDatasetList()
    )
  );

const datasetListOperations = { datasetListEpic, resetDatasetListEpic };

export {
  DATASETLIST_REQUEST,
  DATASETLIST_FULFILL,
  DATASETLIST_REJECT,
  DATASETLIST_RESET,
  datasetListTypes,
  requestDatasetList,
  fulfillDatasetList,
  rejectDatasetList,
  resetDatasetList,
  datasetListActions,
  datasetListSelector,
  datasetListDataSelector,
  datasetListMetaSelector,
  datasetListSelectors,
  datasetListEpic,
  resetDatasetListEpic,
  datasetListOperations,
  datasetListInitialState,
  reducerName,
  actionDomain
};

export default datasetList;
