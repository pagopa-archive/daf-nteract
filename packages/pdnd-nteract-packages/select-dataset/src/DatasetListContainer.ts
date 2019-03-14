import { connect } from "react-redux";

import {
  datasetListSelector,
  requestDatasetList
} from "../duck/datasetListDuck";
import { requestDataset } from "../duck/selectedDatasetDuck";
import DatasetListSuggest from "./DatasetListSuggest";

const DatasetListContainer = connect(
  state => ({ ...datasetListSelector(state) }), // mapStateToProps,
  { requestDatasetList, requestDataset } // mapDispatchToProps
)(DatasetListSuggest);

export default DatasetListContainer;
