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

const pdndActionTypes = {
  ...selectedDatasetTypes,
  ...datasetListTypes,
  ...loggedUserTypes
};

const pdndInitialState = {
  selectedDatasetInitialState,
  datasetListInitialState,
  loggedUserInitialState
};

const pdndReducers = {
  selectedDataset,
  datasetList,
  loggedUser
};

const pdndActionCreators = {
  ...selectedDatasetActions,
  ...datasetListActions,
  ...loggedUserActions
};

const pdndSelectors = {
  ...selectedDatasetSelectors,
  ...datasetListSelectors,
  ...loggedUserSelectors
};

const pdndEpics = [
  selectedDatasetOperations.datasetEpic,
  selectedDatasetOperations.requestDatasetEpic,
  datasetListOperations.datasetListEpic,
  datasetListOperations.resetDatasetListEpic,
  loggedUserOperations.loginEpic,
  loggedUserOperations.requestLoginEpic,
  loggedUserOperations.rejectLoginEpic,
  loggedUserOperations.logoutEpic
];

export {
  selectedDatasetDuck,
  datasetListDuck,
  loggedUserDuck,
  pdndActionTypes,
  pdndInitialState,
  pdndReducers,
  pdndActionCreators,
  pdndSelectors,
  pdndEpics
};
