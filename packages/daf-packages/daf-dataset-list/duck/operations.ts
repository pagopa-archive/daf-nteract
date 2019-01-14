import { filter, map, switchMap, catchError } from "rxjs/operators"
import { ajax } from "rxjs/ajax"
import { of } from "rxjs"

import { DATASETLIST_REQUEST } from './types'
import { fulfillDatasetList, rejectDatasetList } from './actions'

const datasetListEpic = action$ => {
  const source = 'https://api.daf.teamdigitale.it/dati-gov/v1/public/elasticsearch/search'

  return action$.pipe(
    filter(({ type }) => type === DATASETLIST_REQUEST), // ofType(DATASETLIST_REQUEST),
    switchMap(({ payload }) =>
      ajax
        .post(
          source,
          JSON.stringify({
            'text': payload,
            'index': ['catalog_test', 'ext_opendata'],
            'org': [],
            'theme': [],
            'date': "",
            'status': [],
            'order': "desc"
          }),
          {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        )
        .pipe(
          map(({ response }) =>
            response.map(({ type, match, source }) =>
              ({
                type,
                match/* : JSON.parse(match) */,
                source: JSON.parse(source)
              })
            )
          ),
          map(mappedResponse => fulfillDatasetList(mappedResponse)),
          catchError(error => of(rejectDatasetList(error)))
        )
    )
  )
}

export { datasetListEpic }