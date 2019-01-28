import { createSelector } from "reselect";

import { reducerName } from "./utils";

const datasetListSelector = createSelector(
  state => state["daf"][reducerName],
  datasetList =>
    datasetList
      .get("data")
      .filter(datasetEntry => datasetEntry.get("type") === "catalog_test")
      .map(datasetEntry => datasetEntry.get("source").get("dcatapit"))
      // .map(datasetEntry => ImmutableMap({ ...JSON.parse(datasetEntry.get('source')) }))
      .toJS()
);

export { datasetListSelector };
