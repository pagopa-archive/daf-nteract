// import { combineReducers } from 'redux'
import {
  fromJS,
  Map as ImmutableMap,
  List as ImmutableList
} from 'immutable'

import {
  DATASETLIST_REQUEST,
  DATASETLIST_FULFILL,
  DATASETLIST_REJECT,
  DATASETLIST_RESET
} from './types'

const initialState = ImmutableMap({ //Suggested fromJS()
  data: ImmutableList(),
  meta: ImmutableMap({ error: false, isLoading: false, hasLoaded: false })
})

const datasetList = (state = initialState, { type, payload, error, meta }) => ({
  [DATASETLIST_REQUEST]: initialState,

  [DATASETLIST_FULFILL]: ImmutableMap({
    data: fromJS(payload),
    meta: ImmutableMap({ ...meta , error: false })
  }),

  [DATASETLIST_REJECT]: ImmutableMap({
    data: fromJS(payload),
    meta: ImmutableMap({ ...meta , error })
  }),
  
  [DATASETLIST_RESET]: initialState

}[type] || state)

export { initialState }

export default datasetList