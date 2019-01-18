import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import DatasetListSelect  from './components/DatasetListSelect'
import { selectors, actions } from "../daf-core"

const { requestDatasetList, selectDataset } = actions
const { datasetListSelector } = selectors

class DafDatasetListSelect extends PureComponent {
  constructor(props: any) {
    super(props)
    props.requestDatasetList("ricette")
  }

  render() {
    return <DatasetListSelect { ...this.props } />
  }
}

export default connect(
  state => ({ datasetList: datasetListSelector(state) }), //mapStateToProps
  { requestDatasetList, selectDataset } //mapDispatchToProps
)(DafDatasetListSelect)