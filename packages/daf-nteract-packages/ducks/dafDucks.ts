import selectedDataset, {
  selectedDatasetTypes,
  selectedDatasetActions,
  selectedDatasetSelectors,
  selectedDatasetOperations,
  selectedDatasetInitialState
} from "../select-dataset/duck/selectedDatasetDuck";

import datasetList, {
  datasetListTypes,
  datasetListActions,
  datasetListSelectors,
  datasetListOperations,
  datasetListInitialState
} from "../select-dataset/duck/datasetListDuck";

const selectedDatasetDuck = {
  selectedDatasetTypes,
  selectedDatasetInitialState,
  selectedDataset,
  selectedDatasetActions,
  selectedDatasetSelectors,
  selectedDatasetOperations
};

const datasetListDuck = {
  datasetListTypes,
  datasetListInitialState,
  datasetList,
  datasetListActions,
  datasetListSelectors,
  datasetListOperations
};

const dafActionTypes = {
  ...selectedDatasetTypes,
  ...datasetListTypes
};

const dafInitialState = {
  selectedDatasetInitialState,
  datasetListInitialState
};

const dafReducers = {
  selectedDataset,
  datasetList
};

const dafActionCreators = {
  ...selectedDatasetActions,
  ...datasetListActions
};

const dafSelectors = {
  ...selectedDatasetSelectors,
  ...datasetListSelectors
};

const dafEpics = [
  selectedDatasetOperations.datasetEpic,
  selectedDatasetOperations.requestDatasetEpic,
  datasetListOperations.datasetListEpic,
  datasetListOperations.resetDatasetListEpic
];

export {
  selectedDatasetDuck,
  datasetListDuck,
  dafActionTypes,
  dafInitialState,
  dafReducers,
  dafActionCreators,
  dafSelectors,
  dafEpics
};
