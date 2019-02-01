import { createSelector } from "reselect";

import { reducerName } from "./utils";

const datasetListDataSelector = createSelector(
  state => state["daf"][reducerName],
  datasetList =>
    datasetList
      .get("data")
      .map(datasetEntry => datasetEntry.get("dcatapit"))
      .toJS()
);

const datasetListMetaSelector = createSelector(
  state => state["daf"][reducerName],
  datasetList =>
    datasetList
      .get("meta")
      .toJS()
);

const datasetListSelector = createSelector(
 [datasetListDataSelector, datasetListMetaSelector],
  (datasetList, meta) => ({ datasetList, ...meta })
);

export { datasetListDataSelector, datasetListMetaSelector, datasetListSelector };
