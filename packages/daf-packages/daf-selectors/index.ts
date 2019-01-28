import { duckSelectors as datasetListSelectors } from "../daf-dataset-list/duck"
import {
  duckSelectors as selectedDatasetSelectors
} from "../daf-selected-dataset/duck"

const { datasetListSelector } = datasetListSelectors

const { selectedDatasetSelector } = selectedDatasetSelectors

export { datasetListSelector, selectedDatasetSelector }