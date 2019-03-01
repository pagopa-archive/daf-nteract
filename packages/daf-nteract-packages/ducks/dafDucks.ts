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

import loggedUser, {
  loggedUserTypes,
  loggedUserActions,
  loggedUserSelectors,
  loggedUserOperations,
  loggedUserInitialState
} from "../login/duck/loginDuck";

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

const loggedUserDuck = {
  loggedUserTypes,
  loggedUserInitialState,
  loggedUser,
  loggedUserActions,
  loggedUserSelectors,
  loggedUserOperations
};

const dafActionTypes = {
  ...selectedDatasetTypes,
  ...datasetListTypes,
  ...loggedUserTypes
};

const dafInitialState = {
  selectedDatasetInitialState,
  datasetListInitialState,
  loggedUserInitialState
};

const dafReducers = {
  selectedDataset,
  datasetList,
  loggedUser
};

const dafActionCreators = {
  ...selectedDatasetActions,
  ...datasetListActions,
  ...loggedUserActions
};

const dafSelectors = {
  ...selectedDatasetSelectors,
  ...datasetListSelectors,
  ...loggedUserSelectors
};

const dafEpics = [
  selectedDatasetOperations.datasetEpic,
  selectedDatasetOperations.requestDatasetEpic,
  datasetListOperations.datasetListEpic,
  datasetListOperations.resetDatasetListEpic,
  loggedUserOperations.loginEpic,
  loggedUserOperations.requestLoginEpic,
  loggedUserOperations.logoutEpic
];

export {
  selectedDatasetDuck,
  datasetListDuck,
  loggedUserDuck,
  dafActionTypes,
  dafInitialState,
  dafReducers,
  dafActionCreators,
  dafSelectors,
  dafEpics
};
