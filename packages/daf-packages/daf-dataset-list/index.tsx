import React, { PureComponent } from "react";
import { connect } from "react-redux";

import DatasetListSelect from "./components/DatasetListSelect";
import { selectors, actions } from "../daf-core";

const { requestDataset, requestDatasetList } = actions;
const { datasetListSelector } = selectors;

class DafDatasetListSelect extends PureComponent {
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log(this.props);
    return <DatasetListSelect {...this.props} />
  }
}

export default connect(
  state => ({ ...datasetListSelector(state) }), //mapStateToProps
  { requestDataset, requestDatasetList } //mapDispatchToProps
)(DafDatasetListSelect);
