import { of } from "rxjs";
import { take, map, switchMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";
import { Map as ImmutableMap, List as ImmutableList, fromJS } from "immutable";

import { FOCUS_CELL, updateCellSource } from "@nteract/actions/src";
import { cellById as cellByIdSelector } from "@nteract/selectors/src/notebook";
import { model as modelSelector } from "@nteract/selectors/src";

const appName = "nteract-daf";
const reducerName = "selectedDataset";
const actionDomain = appName + "/" + reducerName + "/";

const DATASET_REQUEST = actionDomain + "REQUEST";
const DATASET_FULFILL = actionDomain + "FULFILL";
const DATASET_REJECT = actionDomain + "REJECT";

const duckTypes = { DATASET_REQUEST, DATASET_FULFILL, DATASET_REJECT };

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

const duckActions = { requestDataset, fulfillDataset, rejectDataset };

const datasetSelector = createSelector(
  state => state["daf"][reducerName],
  selectedDataset => selectedDataset.toJS()
);

const datasetMetaSelector = createSelector(
  [datasetSelector],
  dataset => dataset.meta
);

const duckSelectors = { datasetSelector, datasetMetaSelector };

const basicSecret = "";

const encodeDatasetURI = datasetURI => encodeURIComponent(datasetURI);

const makeDatasetSnippet = datasetURI => `
url = "https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeDatasetURI(
  datasetURI
)}?format=json"
payload = ""

headers = {'authorization': 'Basic ${basicSecret}'}
response = requests.request("GET", url, data=payload, headers=headers)
anpr_row = pd.read_json(StringIO(response.text))`;

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
        const { contentRef, id } = focusedCell.payload;

        //getFocusedCellValue
        const value =
          cellByIdSelector(modelSelector(state$.value, { contentRef }), {
            id
          }).get("source", "") +
          "\n" +
          makeDatasetSnippet(selectedDataset.payload);

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
          Authorization: "Basic " + basicSecret
        })
        .pipe(
          map(({ response }) => response.operational.logical_uri),
          map(mappedResponse => fulfillDataset(mappedResponse)),
          catchError(error => of(rejectDataset(error)))
        )
    )
  );
};

const duckOperations = {
  datasetEpic,
  requestDatasetEpic
};

const initialState = ImmutableMap({
  //Suggested fromJS()
  data: ImmutableList(),
  meta: ImmutableMap({ error: false, isLoading: false, hasLoaded: false })
});
const selectedDataset = (
  state = initialState,
  { type, payload, error, meta }
) =>
  ({
    [DATASET_REQUEST]: initialState,

    [DATASET_FULFILL]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error: false })
    }),

    [DATASET_REJECT]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error })
    })
  }[type] || state);

export {
  duckSelectors,
  duckOperations,
  duckTypes,
  duckActions,
  initialState,
  reducerName,
  actionDomain
};

export default selectedDataset;
