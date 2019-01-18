import { createSelector } from 'reselect'
import { filter, map } from 'rxjs/operators'

const appName = 'nteract-daf'
const reducerName = 'selectedDataset'
const actionDomain = appName + '/' + reducerName + '/'

const DATASET_SELECT = actionDomain + 'SELECT'
const DATASET_SET = actionDomain + 'SET'
const duckTypes = { DATASET_SELECT, DATASET_SET }

const selectDataset = payload => ({ type: DATASET_SELECT, payload })
const setDataset = payload => ({ type: DATASET_SET, payload })
const duckActions = { selectDataset, setDataset }

const selectedDatasetSelector = createSelector(state => state[reducerName], x => x)
const duckSelectors = { selectedDatasetSelector }

const datasetEpic = action$ => action$.pipe(
  filter(({ type }) => type === DATASET_SELECT),
  map(({ payload }) => setDataset(payload))
)
const duckOperations = { datasetEpic }

const initialState = ''

const selectedDataset = (state = initialState, { type, payload }) => ({
  [DATASET_SELECT]: initialState,
  [DATASET_SET]: payload
}[type] || state)

export {
  duckSelectors,
  duckOperations,
  duckTypes,
  duckActions,
  initialState,
  reducerName,
  actionDomain
}

export default selectedDataset