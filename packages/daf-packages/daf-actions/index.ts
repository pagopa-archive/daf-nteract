import { duckActions as datasetListActions } from "../daf-dataset-list/duck"
import {
  duckActions as selectedDatasetActions
} from "../daf-selected-dataset/duck"

export const {
  requestDatasetList,
  fulfillDatasetList,
  rejectDatasetList
} = datasetListActions

export const {
  selectDataset,
  setDataset
} = selectedDatasetActions