import apiUriConfig from "./apiUriConfig"

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

import saveDataset, {
  saveDatasetTypes,
  saveDatasetActions,
  saveDatasetSelectors,
  saveDatasetOperations,
  saveDatasetInitialState
} from "../save-dataset/duck/saveDatasetDuck";

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

const saveDatasetDuck = {
  saveDatasetTypes,
  saveDatasetInitialState,
  saveDataset,
  saveDatasetActions,
  saveDatasetSelectors,
  saveDatasetOperations
};

const pdndActionTypes = {
  ...selectedDatasetTypes,
  ...datasetListTypes,
  ...loggedUserTypes,
  ...saveDatasetTypes
};

const pdndInitialState = {
  selectedDatasetInitialState,
  datasetListInitialState,
  loggedUserInitialState,
  saveDatasetInitialState
};

const pdndReducers = {
  selectedDataset,
  datasetList,
  loggedUser,
  saveDataset
};

const pdndActionCreators = {
  ...selectedDatasetActions,
  ...datasetListActions,
  ...loggedUserActions,
  ...saveDatasetActions
};

const pdndSelectors = {
  ...selectedDatasetSelectors,
  ...datasetListSelectors,
  ...loggedUserSelectors,
  ...saveDatasetSelectors
};

const pdndEpics = [
  selectedDatasetOperations.datasetEpic,
  selectedDatasetOperations.requestDatasetEpic,
  datasetListOperations.datasetListEpic,
  datasetListOperations.resetDatasetListEpic,
  loggedUserOperations.loginEpic,
  loggedUserOperations.requestLoginEpic,
  loggedUserOperations.rejectLoginEpic,
  loggedUserOperations.logoutEpic,
  saveDatasetOperations.datasetSaveEpic,
  saveDatasetOperations.requestDatasetSaveEpic
];

export {
  selectedDatasetDuck,
  datasetListDuck,
  loggedUserDuck,
  saveDatasetDuck,
  pdndActionTypes,
  pdndInitialState,
  pdndReducers,
  pdndActionCreators,
  pdndSelectors,
  pdndEpics,
  apiUriConfig
};
