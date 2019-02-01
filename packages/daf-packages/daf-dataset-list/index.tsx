import React, { PureComponent } from "react";
import { connect } from "react-redux";

import DatasetListSelect from "./components/DatasetListSelect";
import { selectors, actions } from "../daf-core";
import { Spinner, Intent } from "@blueprintjs/core";

const { requestDataset } = actions;
const { datasetListSelector } = selectors;

class DafDatasetListSelect extends PureComponent {
  constructor(props: any) {
    super(props);
  }

  render() {
    console.log(this.props);
    const {
      datasetList,
      requestDataset,
      isLoading,
      hasLoaded,
      error
    } = this.props;
    return hasLoaded ? (
      <DatasetListSelect
        datasetList={datasetList}
        requestDataset={requestDataset}
      />
    ) : (
      <Spinner />
    );
  }
}

export default connect(
  state => ({ ...datasetListSelector(state) }), //mapStateToProps
  { requestDataset } //mapDispatchToProps
)(DafDatasetListSelect);
