import {
  duckOperations as datasetListOperations
} from "../daf-dataset-list/duck"
import {
  duckOperations as selectedDatasetOperations
} from "../daf-selected-dataset/duck"

const { datasetListEpic } = datasetListOperations

const { datasetEpic } = selectedDatasetOperations

const allDafEpics = [ datasetListEpic, datasetEpic ]

export { allDafEpics, datasetListEpic, datasetEpic }
 