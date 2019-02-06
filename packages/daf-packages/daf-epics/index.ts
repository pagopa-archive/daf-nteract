import {
  duckOperations as datasetListOperations
} from "../daf-dataset-list/duck"
import {
  duckOperations as selectedDatasetOperations
} from "../daf-selected-dataset/duck"

const { datasetListEpic, requestDatasetListEpic } = datasetListOperations

const { datasetEpic, requestDatasetEpic } = selectedDatasetOperations

const allDafEpics = [ datasetListEpic, /* requestDatasetListEpic, */ datasetEpic, requestDatasetEpic ]

export { allDafEpics, datasetListEpic, requestDatasetListEpic, datasetEpic, requestDatasetEpic }
 