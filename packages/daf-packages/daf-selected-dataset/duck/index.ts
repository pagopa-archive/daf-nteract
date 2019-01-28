import { createSelector } from "reselect";
import { mergeMap, map } from "rxjs/operators";
import { FOCUS_CELL, updateCellSource } from "@nteract/actions/src";
import { ofType } from "redux-observable";
import { cellById } from "@nteract/selectors/src/notebook";
import { model } from "@nteract/selectors/src";

const appName = "nteract-daf";
const reducerName = "selectedDataset";
const actionDomain = appName + "/" + reducerName + "/";

const DATASET_SELECT = actionDomain + "SELECT";
const duckTypes = { DATASET_SELECT };

const selectDataset = payload => ({ type: DATASET_SELECT, payload });
const duckActions = { selectDataset };

const selectedDatasetSelector = createSelector(
  state => state[reducerName],
  x => x
);
const duckSelectors = { selectedDatasetSelector };

const datasetEpic = (action$, state$) =>
  action$.pipe(
    ofType(DATASET_SELECT),
    mergeMap(
      action => action$.ofType(FOCUS_CELL),
      (selectedDataset, focusedCell) => {
        const { contentRef, id } = focusedCell.payload;
        //getFocusedCellValue
        const value =
          cellById(model(state$.value, { contentRef }), { id }).get(
            "source",
            ""
          ) + " " + selectedDataset.payload.name;

        return updateCellSource({ id, value, contentRef });
      }
    )
  );

const duckOperations = { datasetEpic };

const initialState = "";

const selectedDataset = (state = initialState, { type, payload }) =>
  ({
    [DATASET_SELECT]: payload || initialState,
  }[type] || state);

export {
  duckSelectors,
  duckOperations,
  duckTypes,
  duckActions,
  initialState,
  reducerName,
  actionDomain
};

export default selectedDataset;
