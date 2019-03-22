import { of } from "rxjs";
import { take, map, switchMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";
import { Map as ImmutableMap, List as ImmutableList, fromJS } from "immutable";

import { FOCUS_CELL, updateCellSource } from "@nteract/actions/src";
import { cellById as cellByIdSelector } from "@nteract/selectors/src/notebook";
import { model as modelSelector } from "@nteract/selectors/src";
import { tokensSelector } from "../../login/duck/loginDuck";

// actionTypes
const appName = "nteract-pdnd";
const reducerName = "selectedDataset";
const actionDomain = appName + "/" + reducerName + "/";

const DATASET_REQUEST = actionDomain + "REQUEST";
const DATASET_FULFILL = actionDomain + "FULFILL";
const DATASET_REJECT = actionDomain + "REJECT";

const selectedDatasetTypes = {
  DATASET_REQUEST,
  DATASET_FULFILL,
  DATASET_REJECT
};

// reducer
const selectedDatasetInitialState = ImmutableMap({
  data: ImmutableList(),
  meta: ImmutableMap({ error: false, isLoading: false, hasLoaded: false })
});
const selectedDataset = (
  state = selectedDatasetInitialState,
  { type, payload, error, meta }
) =>
  ({
    [DATASET_REQUEST]: selectedDatasetInitialState,

    [DATASET_FULFILL]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error: false })
    }),

    [DATASET_REJECT]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error })
    })
  }[type] || state);

// actionCreators
const requestDataset = (payload = "") => ({
  type: DATASET_REQUEST,
  payload: payload,
  meta: { isLoading: true, hasLoaded: false }
});

const fulfillDataset = response => ({
  type: DATASET_FULFILL,
  payload: response,
  meta: { isLoading: false, hasLoaded: true }
});

const rejectDataset = error => ({
  type: DATASET_REJECT,
  payload: error,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
});

const selectedDatasetActions = {
  requestDataset,
  fulfillDataset,
  rejectDataset
};

// selectors
const datasetSelector = createSelector(
  state => state["pdnd"][reducerName],
  selectedDataset => selectedDataset.toJS()
);

const datasetMetaSelector = createSelector(
  [datasetSelector],
  dataset => dataset.meta
);

const selectedDatasetSelectors = { datasetSelector, datasetMetaSelector };

// operations
const makeDatasetSnippet = ({ datasetURI, basicToken }): string =>
  `url = "https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
    datasetURI
  )}?format=json"
payload = ""

headers = {'authorization': 'Basic ${basicToken}'}
response = requests.request("GET", url, data=payload, headers=headers)
data = pd.read_json(StringIO(response.text))
data`;

//// epics
const datasetEpic = (action$, state$) =>
  action$.pipe(
    ofType(FOCUS_CELL),
    switchMap(
      action =>
        action$.pipe(
          ofType(DATASET_FULFILL),
          take(1)
        ),
      (focusedCell, selectedDataset) => {
        const state = state$.value;
        const { contentRef, id } = focusedCell.payload;
        const { basicToken } = { ...tokensSelector(state) };
        const value =
          cellByIdSelector(modelSelector(state, { contentRef }), {
            id
          }).get("source", "") +
          "\n" +
          makeDatasetSnippet({
            datasetURI: selectedDataset.payload,
            basicToken
          });

        return updateCellSource({ id, value, contentRef });
      }
    )
  );

const requestDatasetEpic = action$ => {
  const endpoint =
    "https://api.daf.teamdigitale.it/catalog-manager/v1/public/catalog-ds/getbyname/";

  return action$.pipe(
    ofType(DATASET_REQUEST),
    switchMap(({ payload }) =>
      ajax
        .get(endpoint + payload, {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " // + basicSecret
        })
        .pipe(
          map(({ response }) => response.operational.logical_uri),
          map(mappedResponse => fulfillDataset(mappedResponse)),
          catchError(error => of(rejectDataset(error)))
        )
    )
  );
};

const selectedDatasetOperations = {
  datasetEpic,
  requestDatasetEpic
};

export {
  DATASET_REQUEST,
  DATASET_FULFILL,
  DATASET_REJECT,
  selectedDatasetTypes,
  requestDataset,
  fulfillDataset,
  rejectDataset,
  selectedDatasetActions,
  datasetSelector,
  datasetMetaSelector,
  selectedDatasetSelectors,
  datasetEpic,
  requestDatasetEpic,
  selectedDatasetOperations,
  selectedDatasetInitialState,
  reducerName,
  actionDomain
};

export default selectedDataset;
