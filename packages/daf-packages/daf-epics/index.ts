import { duckOperations as datasetListOperations } from "../daf-dataset-list/duck";
import { duckOperations as selectedDatasetOperations } from "../daf-selected-dataset/duck";

const { datasetListEpic, resetDatasetListEpic } = datasetListOperations;

const { datasetEpic, requestDatasetEpic } = selectedDatasetOperations;

const allDafEpics = [
  datasetListEpic,
  resetDatasetListEpic,
  datasetEpic,
  requestDatasetEpic
];

export {
  allDafEpics,
  datasetListEpic,
  resetDatasetListEpic,
  datasetEpic,
  requestDatasetEpic
};
