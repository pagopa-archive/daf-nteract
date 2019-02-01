import React from "react";
import { connect } from "react-redux";

import { selectors } from "../daf-core"
import DafDatasetSearch from "./DafDatasetSearch";

const { datasetMetaSelector } = selectors;

export default connect(
  state => ({ ...datasetMetaSelector(state) }), //mapStateToProps
  // { requestDataset } //mapDispatchToProps
)(DafDatasetSearch)