import { createSelector } from 'reselect'

import { reducerName } from './utils'

const datasetListSelector = createSelector(
  state => state[reducerName],
  datasetList => datasetList
    .get('data')
    .filter(datasetEntry => {
      const type = datasetEntry.get('type')
      return type === 'ext_opendata' /* || type === 'catalog_test' */
    })
    // .map(datasetEntry => ImmutableMap({ ...JSON.parse(datasetEntry.get('source')) }))
    .toJS()
)

export { datasetListSelector }