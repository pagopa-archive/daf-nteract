import {
  DATASETLIST_REQUEST,
  DATASETLIST_FULFILL,
  DATASETLIST_REJECT,
  DATASETLIST_RESET
} from './types'

const requestDatasetList = (payload = "") => ({
  type: DATASETLIST_REQUEST,
  payload: payload,
  meta: { isLoading: true, hasLoaded: false }
})

const fulfillDatasetList = response => ({
  type: DATASETLIST_FULFILL,
  payload: response,
  meta: { isLoading: false, hasLoaded: true }
})

const rejectDatasetList = error => ({
  type: DATASETLIST_REJECT,
  payload: error,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
})

const resetDatasetList = () => ({
  type: DATASETLIST_RESET
})

export {
  requestDatasetList,
  fulfillDatasetList,
  rejectDatasetList,
  resetDatasetList
}
