import reducer, { initialState } from "./reducers"

import * as duckTypes from './types'
import * as duckActions from './actions'
import * as duckSelectors from './selectors' 
import * as duckOperations from './operations'
import { reducerName, actionDomain } from './utils'

export {
  duckSelectors,
  duckOperations,
  duckTypes,
  duckActions,
  initialState,
  reducerName,
  actionDomain
}

export default reducer