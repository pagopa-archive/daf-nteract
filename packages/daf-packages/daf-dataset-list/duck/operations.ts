import { of } from "rxjs";
import {
  map,
  take,
  debounceTime,
  switchMap,
  concatMap,
  catchError
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { SET_IN_CELL } from "@nteract/actions/src";

import { DATASETLIST_REQUEST } from "./types";
import {
  fulfillDatasetList,
  rejectDatasetList,
  resetDatasetList
} from "./actions";
import { duckTypes } from "../../daf-selected-dataset/duck";

const { DATASET_FULFILL } = duckTypes;

const datasetListEpic = action$ => {
  const endpoint =
    "https://api.daf.teamdigitale.it/dati-gov/v1/public/elasticsearch/search";

  return action$.pipe(
    debounceTime(900),
    ofType(DATASETLIST_REQUEST),
    switchMap(({ payload }) =>
      ajax
        .post(
          endpoint,
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
};

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

export { datasetListEpic, resetDatasetListEpic };
