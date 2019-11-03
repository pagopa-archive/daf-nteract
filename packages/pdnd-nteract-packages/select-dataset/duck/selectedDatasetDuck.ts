import { of } from "rxjs";
import { take, map, switchMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";
import { Map as ImmutableMap, List as ImmutableList, fromJS } from "immutable";

import { FOCUS_CELL, updateCellSource } from "@nteract/actions/src";
import { cellById as cellByIdSelector } from "@nteract/selectors/src/core/contents/notebook";
import { model as modelSelector } from "@nteract/selectors/src";
import { tokensSelector } from "../../login/duck/loginDuck";

//TODO check if is better another way
import { selectors } from "@nteract/core";
import { apiUriConfig } from "../../ducks";

const { BASE_API_URI } = apiUriConfig;

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

// operations (TODO: needs refactor)
const makeDatasetSnippet = ({ datasetURI, bearerToken }): string =>
  `url = "${BASE_API_URI}dataset-manager/v1/dataset/${encodeURIComponent(
    datasetURI
  )}?format=json"
payload = ""

headers = {'authorization': 'Bearer ${bearerToken}'}
response = requests.request("GET", url, data=payload, headers=headers)
data = pd.read_json(StringIO(response.text))
data`;

const makeDatasetSnippetByKernel = ({
  datasetURI,
  bearerToken,
  kernelName,
  metacatalog
}): string => {
  if (kernelName == "python3") {
    const dataVar = metacatalog.dcatapit.name; // .substring(0, 20);
    return `url = "${BASE_API_URI}dataset-manager/v1/dataset/${encodeURIComponent(
      datasetURI
    )}?format=json" 
payload = ""
headers = {'authorization': 'Bearer YOU_MUST_BE_LOGGEDIN'}
response = requests.request("GET", url, data=payload, headers=headers)
${dataVar} = pd.read_json(StringIO(response.text))
${dataVar}`;
  } else if (kernelName == "scala") {
    return `import ammonite.ops._, scalaj.http._
val resp = Http("${BASE_API_URI}dataset-manager/v1/dataset/${encodeURIComponent(
      datasetURI
    )}?format=json")
.headers(Seq("Authorization" -> ("Bearer YOU_MUST_BE_LOGGEDIN"),
"content-Type" -> "application/json"))
.asString
val ${
      metacatalog.dcatapit.name
    }  = ujson.read(resp.body).asInstanceOf[ujson.Js.Arr]
      `;
  } else if (kernelName == "ir") {
    return `options(repr.matrix.max.rows = 10)
library(httr)
#install.packages("ggplot2")
library(ggplot2)
library(IRdisplay)
data <- GET("${BASE_API_URI}dataset-manager/v1/dataset/${encodeURIComponent(
      datasetURI
    )}?format=csv", 
  add_headers(Authorization = "Bearer YOU_MUST_BE_LOGGEDIN"))
content <- content(data)
${metacatalog.dcatapit.name} <- read.csv(text=content, header=TRUE, sep=",")
${metacatalog.dcatapit.name}`;
  } else if (kernelName == "julia-1.1") {
    return `using Pkg
Pkg.add("HTTP");
Pkg.add("DataFrames");
Pkg.add("CSV");
Pkg.add("Plots")
using Plots;
using HTTP;
using CSV;
res = HTTP.request("GET",
  "${BASE_API_URI}dataset-manager/v1/dataset/${encodeURIComponent(
      datasetURI
    )}?format=csv",
  [("Authorization", "Bearer YOU_MUST_BE_LOGGEDIN")]);
${metacatalog.dcatapit.name} = CSV.read(IOBuffer(res.body));
${metacatalog.dcatapit.name}
`;
  } else if (kernelName == "pysparkkernel") {
    const physicalUrl = metacatalog.operational.physical_uri;
    const name = metacatalog.dcatapit.name;
    if (
      metacatalog.operational.ext_opendata === null ||
      metacatalog.operational.ext_opendata === undefined
    ) {
      return `path_dataset = "${physicalUrl}"
${metacatalog.dcatapit.name} = (spark.read.format("parquet") 
.option("inferSchema", "true") 
.load(path_dataset)
)
${metacatalog.dcatapit.name}`;
    } else {
      return `path_dataset = "${physicalUrl}/${name}.csv"
${metacatalog.dcatapit.name} = (spark.read.format("csv") 
.option("inferSchema", "true") 
.option("header", "true")
.load(path_dataset)
)
${metacatalog.dcatapit.name}`;
    }
  } else {
    return "kernel not supported yet";
  }
};

/// epics
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
        const { bearerToken } = { ...tokensSelector(state) };

        const model = selectors.model(state, { contentRef });
        // Is not correct when switch kernel
        //const kernelName = selectors.notebook.displayName(model)
        // Use this instead of kernelName
        const kernel = selectors.currentKernel(state);
        const kernelSpec = kernel.kernelSpecName;

        const value =
          cellByIdSelector(modelSelector(state, { contentRef }), {
            id
          }).get("source", "") +
          "\n" +
          makeDatasetSnippetByKernel({
            bearerToken,
            datasetURI: selectedDataset.payload.operational.logical_uri,
            kernelName: kernelSpec,
            metacatalog: selectedDataset.payload
          });

        return updateCellSource({ id, value, contentRef });
      }
    )
  );

const requestDatasetEpic = action$ =>
  action$.pipe(
    ofType(DATASET_REQUEST),
    switchMap(({ payload }) =>
      ajax
        .get(
          BASE_API_URI +
            "catalog-manager/v1/public/catalog-ds/getbyname/" +
            payload,
          {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Basic " // + basicSecret
          }
        )
        .pipe(
          //  map(({ response }) => response.operational.logical_uri),
          map(({ response }) => response),
          map(mappedResponse => fulfillDataset(mappedResponse)),
          catchError(error => of(rejectDataset(error)))
        )
    )
  );

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
