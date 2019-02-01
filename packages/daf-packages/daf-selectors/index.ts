import { duckSelectors as datasetListSelectors } from "../daf-dataset-list/duck";
import { duckSelectors as datasetSelectors } from "../daf-selected-dataset/duck";

const {
  datasetListDataSelector,
  datasetListMetaSelector,
  datasetListSelector
} = datasetListSelectors;

const { datasetSelector, datasetMetaSelector } = datasetSelectors;

export {
  datasetListDataSelector,
  datasetListMetaSelector,
  datasetListSelector,
  datasetSelector,
  datasetMetaSelector
};
