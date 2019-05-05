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

//TODO check if is better another way
import { selectors } from "@nteract/core";

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
const makeDatasetSnippet = ({ datasetURI, basicToken, bearerToken }): string =>
  `url = "https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
    datasetURI
  )}?format=json"
payload = ""

headers = {'authorization': 'Bearer ${bearerToken}'}
response = requests.request("GET", url, data=payload, headers=headers)
data = pd.read_json(StringIO(response.text))
data`;

const makeDatasetSnippetByKernel = 
   ({ datasetURI, basicToken, bearerToken, kernelName, metacatalog }): string => {
      if(kernelName == 'Python 3') {
       return `url = "https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
          datasetURI
        )}?format=json"
payload = ""
headers = {'authorization': 'Bearer ${bearerToken}'}
response = requests.request("GET", url, data=payload, headers=headers)
data = pd.read_json(StringIO(response.text))
data`;
      } else if(kernelName == 'Scala'){
       return `import ammonite.ops._, scalaj.http._
val resp = Http("https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
        datasetURI)}?format=json")
.headers(Seq("Authorization" -> ("Bearer ${bearerToken}"),
"content-Type" -> "application/json"))
.asString
val parsed  = ujson.read(resp.body).asInstanceOf[ujson.Js.Arr]
      `
      } else if(kernelName == 'R'){
        return `library(httr)
#install.packages("ggplot2")
library(ggplot2)
library(IRdisplay)
data <- GET("https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
  datasetURI)}?format=csv", 
  add_headers(Authorization = "Bearer ${bearerToken}"))
content <- content(data)
csv <- read.csv(text=content, header=TRUE, sep=",")
csv`
      }else if(kernelName == 'Julia'){
        return `using Pkg
Pkg.add("HTTP");
Pkg.add("DataFrames");
Pkg.add("CSV");
Pkg.add("Plots")
using Plots;
using HTTP;
using CSV;
res = HTTP.request("GET",
  "https://api.daf.teamdigitale.it/dataset-manager/v1/dataset/${encodeURIComponent(
    datasetURI)}?format=csv",
  [("Authorization", "Bearer ${bearerToken}")]);
mycsv = CSV.read(IOBuffer(res.body));
mycsv
`        
      } else if (kernelName == 'PySpark') {
        const physicalUrl = metacatalog.operational.physical_uri
        const name = metacatalog.dcatapit.name
        if(metacatalog.operational.ext_opendata === null || 
          metacatalog.operational.ext_opendata === undefined){
          return `path_dataset = "${physicalUrl}"
dataset = (spark.read.format("parquet") 
.option("inferSchema", "true") 
.load(path_dataset)
)`
        } else {
        return `path_dataset = "${physicalUrl}/${name}.csv"
dataset = (spark.read.format("csv") 
.option("inferSchema", "true") 
.option("header", "true")
.load(path_dataset)
)`
        }
      }else {
        return "kernel not supported yet"
      }
    }
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
        const { basicToken, bearerToken } = { ...tokensSelector(state) };
        
        const model = selectors.model(state, { contentRef });
        const kernelName = selectors.notebook.displayName(model)
        
        const value =
          cellByIdSelector(modelSelector(state, { contentRef }), {
            id
          }).get("source", "") +
          "\n" +
          makeDatasetSnippetByKernel({
            datasetURI: selectedDataset.payload.operational.logical_uri,
            basicToken,
            bearerToken,
            kernelName
            metacatalog: selectedDataset.payload
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
        //  map(({ response }) => response.operational.logical_uri),
          map(({ response }) => response),
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
