// import { createActions, handleActions } from 'redux-actions'

const reducerName = 'datasetSearch'
const actionDomain = 'daf' + '/' + reducerName + '/'

const datasetSource = 'https://api.daf.teamdigitale.it/dati-gov/v1/public/elasticsearch/search'
 
export const FETCH_REQUEST = actionDomain + 'REQUEST'
export const FETCH_FULFILL = actionDomain + 'FULFILL'
export const FETCH_REJECT = actionDomain + 'REJECT'

export const requestFetch = () => ({ type: FETCH_REQUEST })
export const fulfillFetch = res => ({ type: FETCH_FULFILL, payload: res })
export const rejectFetch = err => ({ type: FETCH_FULFILL, payload: err })

export const datasetActionCreator = request => dispatch => {
  const parsedRequest = new Request(datasetSource, {
    method: 'POST',
    body: JSON.stringify({
      date: '',
      index: ["catalog_test", "ext_opendata", "dashboards", "stories"],
      order: 'score',
      org: [],
      owner: '',
      sharedWithMe: false,
      status: [],
      text: request,
      theme: []
    })
  })
  return new Promise(() => dispatch(requestFetch())
    .then(fetch(parsedRequest))
      .then(res => res.ok ?
        res.json().then(data => dispatch(fulfillFetch(data))) :
        dispatch(rejectFetch(res.statusText))
      )
    )
    .catch(err => dispatch(rejectFetch(err)))
}

export const initialState =  { isLoading: false, hasLoaded: false, data: {}, error: {} }

const datasetReducer = (state = initialState, { type, payload, error, meta }) => ({
  [FETCH_REQUEST]: { ...state, isLoading: true, data: {}, error: {}},
  [FETCH_FULFILL]: { ...state, isLoading: false, hasLoaded: true, data: payload, error: {} },
  [FETCH_REJECT]: { ...state, isLoading: false, hasLoaded: false, error: payload, data: {} }
}[type])

// export const fetchActions = createActions({
//   [FETCH_REQUEST]: [x => x, () => ({ isLoading: true, hasLoaded: false })],
//   [FETCH_FULFILL]: [res => res, () => ({ isLoading: false, hasLoaded: true })],
//   [FETCH_REJECT]: [err => err, () => ({ isLoading: false, hasLoaded: false })]
// })

// export const { request, fulfill, reject } = fetchActions['daf'][reducerName]

// const datasetReducer = handleActions(
//   {
//     [FETCH_REQUEST]: ({ datasetSearch }, { meta }) => ({ ...fetch, meta }),
//     [FETCH_FULFILL]: ({ datasetSearch }, { payload, error, meta }) =>
//     ({ ...datasetSearch, payload, error, meta }),
//     [FETCH_REJECT]: ({ datasetSearch }, { payload, error, meta }) =>
//     ({ ...datasetSearch, payload, error, meta })
//   },
//   initialState
//   )


  // const aa = fulfill()
  // console.log(aa)
  // console.log(datasetReducer({}, fulfill({ hello: ''})))

export default datasetReducer