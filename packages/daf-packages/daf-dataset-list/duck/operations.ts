import { of } from "rxjs";
import { map, take, debounceTime, switchMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";

import { DATASETLIST_REQUEST } from "./types";
import {
  requestDatasetList,
  fulfillDatasetList,
  rejectDatasetList
} from "./actions";
import { FETCH_KERNELSPECS_FULFILLED } from "@nteract/actions/src";

const requestDatasetListEpic = action$ =>
  action$.pipe(
    ofType(FETCH_KERNELSPECS_FULFILLED),
    map(() => requestDatasetList()),
    take(1)
  );

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

export { datasetListEpic, requestDatasetListEpic };
