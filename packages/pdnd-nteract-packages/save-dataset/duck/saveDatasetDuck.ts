import { of } from "rxjs";
import { take, map, switchMap, catchError } from "rxjs/operators";
// import { ajax } from "rxjs/ajax";
import { ofType } from "redux-observable";
import { createSelector } from "reselect";
import { Map as ImmutableMap, List as ImmutableList, fromJS } from "immutable";

import { FOCUS_CELL, updateCellSource } from "@nteract/actions/src";
import { cellById as cellByIdSelector } from "@nteract/selectors/src/core/contents/notebook";
import { model as modelSelector } from "@nteract/selectors/src";
import {
  loggedUserDataSelector,
  tokensSelector,
  usernameSelector
} from "../../login/duck/loginDuck";
// append username prop to formdata retrived obj

// actionTypes
const appName = "nteract-pdnd";
const reducerName = "saveDataset";
const actionDomain = appName + "/" + reducerName + "/";

const DATASET_SAVE_REQUEST = actionDomain + "REQUEST";
const DATASET_SAVE_FULFILL = actionDomain + "FULFILL";
const DATASET_SAVE_REJECT = actionDomain + "REJECT";

const saveDatasetTypes = {
  DATASET_SAVE_REQUEST,
  DATASET_SAVE_FULFILL,
  DATASET_SAVE_REJECT
};

// reducer
const saveDatasetInitialState = ImmutableMap({
  data: ImmutableMap(),
  meta: ImmutableMap({ error: false, isLoading: false, hasLoaded: false })
});

const saveDataset = (
  state = saveDatasetInitialState,
  { type, payload, error, meta }
) =>
  ({
    [DATASET_SAVE_REQUEST]: saveDatasetInitialState,

    [DATASET_SAVE_FULFILL]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error: false })
    }),

    [DATASET_SAVE_REJECT]: ImmutableMap({
      data: fromJS(payload),
      meta: ImmutableMap({ ...meta, error })
    })
  }[type] || state);

// actionCreators
const requestDatasetSave = payload => ({
  type: DATASET_SAVE_REQUEST,
  payload: payload,
  meta: { isLoading: true, hasLoaded: false }
});

const fulfillDatasetSave = response => ({
  type: DATASET_SAVE_FULFILL,
  payload: response,
  meta: { isLoading: false, hasLoaded: true }
});

const rejectDatasetSave = error => ({
  type: DATASET_SAVE_REJECT,
  payload: error,
  error: true,
  meta: { isLoading: false, hasLoaded: false }
});

const saveDatasetActions = {
  requestDatasetSave,
  fulfillDatasetSave,
  rejectDatasetSave
};

// selectors
const saveDatasetSelector = createSelector(
  state => state["pdnd"][reducerName],
  saveDataset => saveDataset.toJS()
);

const saveDatasetMetaSelector = createSelector(
  [saveDatasetSelector],
  ({ meta }) => ({ meta })
);

const isEditorOrAdmin = createSelector(
  [loggedUserDataSelector],
  ({ roles = [] }) => ({
    isEditorOrAdmin:
      roles.includes("daf_edt_daf_data") || roles.includes("daf_adm_daf_data")
  })
);

const organizationsSelector = createSelector(
  [loggedUserDataSelector],
  ({ organizations }) => ({ organizations })
);

const saveDatasetSelectors = {
  saveDatasetSelector,
  saveDatasetMetaSelector,
  isEditorOrAdmin,
  organizationsSelector
};

// operations
const makeDatasetSaveSnippet = ({ dataset, bearerToken }): string => {
  const {
    user,
    variable,
    name,
    description,
    theme,
    subtheme,
    organization
  } = dataset;
  return `data = pd.DataFrame.from_dict(${variable})
if 'processing_dttm' in data.columns:
  data.drop('processing_dttm', axis=1, inplace=True)

data.columns = data.columns.str.replace(' ', '_')
data.to_csv("${organization}_${name}.csv", sep=';', encoding='utf-8', index=False)

url = "http://localhost:8080/pdnd-openapi/dataset/save"

file = open('./${organization}_${name}.csv', 'rb').read()

files = [
  ("file", ("${organization}_${name}", file, "text/csv")),
]

metadata = {
  'name' : '${name}',
  'theme' : '${theme}',
  'subtheme' : '${subtheme}',
  'org' : '${organization}',
  'user' : '${user}',
  'description' : '${description}'
}

headers = {'authorization': 'Bearer ${bearerToken}'}

response = requests.request("POST", url, data=metadata, files=files, headers=headers)
os.remove('./${organization}_${name}.csv')
print(response.text)`;
};

//// epics
const datasetSaveEpic = (action$, state$) =>
  action$.pipe(
    ofType(FOCUS_CELL),
    switchMap(
      action =>
        action$.pipe(
          ofType(DATASET_SAVE_FULFILL),
          take(1)
        ),
      (focusedCell, savedDataset) => {
        const state = state$.value;
        const { contentRef, id } = focusedCell.payload;
        const { bearerToken } = { ...tokensSelector(state) };
        const { username } = { ...usernameSelector(state) };
        const value =
          cellByIdSelector(modelSelector(state, { contentRef }), {
            id
          }).get("source", "") +
          "\n" +
          makeDatasetSaveSnippet({
            dataset: {
              user: username,
              ...savedDataset.payload
            },
            bearerToken
          });

        return updateCellSource({ id, value, contentRef });
      }
    )
  );

const requestDatasetSaveEpic = action$ => {
  //   const endpoint =
  //     "https://api.daf.teamdigitale.it/catalog-manager/v1/public/catalog-ds/getbyname/";

  return action$.pipe(
    ofType(DATASET_SAVE_REQUEST),
    switchMap(({ payload }) =>
      //       ajax
      //         .get(endpoint + payload, {
      //           Accept: "application/json",
      //           "Content-Type": "application/json",
      //           Authorization: "Basic " // + basicSecret
      //         })
      of({}).pipe(
        // map(({ response }) => response.operational.logical_uri),
        // map(mappedResponse => fulfillDataset(mappedResponse)),
        map(action => fulfillDatasetSave(payload)),
        catchError(error => of(rejectDatasetSave(error)))
      )
    )
  );
};

const saveDatasetOperations = {
  datasetSaveEpic,
  requestDatasetSaveEpic
};

export {
  DATASET_SAVE_REQUEST,
  DATASET_SAVE_FULFILL,
  DATASET_SAVE_REJECT,
  saveDatasetTypes,
  requestDatasetSave,
  fulfillDatasetSave,
  rejectDatasetSave,
  saveDatasetActions,
  saveDatasetSelector,
  isEditorOrAdmin,
  organizationsSelector,
  saveDatasetMetaSelector,
  saveDatasetSelectors,
  datasetSaveEpic,
  requestDatasetSaveEpic,
  saveDatasetOperations,
  saveDatasetInitialState,
  reducerName,
  actionDomain
};

export default saveDataset;
