// import React from 'react'
// import { compose } from 'redux'
// import { connect } from 'react-redux'
// import { H5, Button, Card, Elevation } from '@blueprintjs/core'
// import { path } from 'ramda'

// import withList from '../reusable-hoc/withList'
// import withMountFn from '../reusable-hoc/withMountFn'
// import withPropsLog from '../reusable-hoc/withPropsLog'
// import { duckActions, duckSelectors } from './duck'

// const { requestDatasetList } = duckActions

// const { datasetListSelector } = duckSelectors

// const cardsList = [
//   { heading: 'heading1', content: (<b>content1</b>) },
//   { heading: 'heading2', content: (<i>content2</i>) },
//   { heading: 'heading3', content: (<pre>content3</pre>) },
// ]

// // const App = withList(cardsList)(TaskCard)

// const DatasetCard = ({heading}) =>
//   <Card interactive={true} elevation={Elevation.THREE} /* style={{margin: '1rem'}} */>
//     <H5><a>{heading}</a></H5>
//     <p>Hello</p>
//   </Card>

// // const PureApp = ({ datasetList = cardsList }) => <>{
// //   datasetList
// //     .filter(({ type }) => type === 'catalog_test' && type === 'ext_opendata')
// //     .map(({ source }) => source.name)
// //     .map(datasetName => <DatasetCard heading={datasetName} />)
// // }</>

// const DatasetSelect = ({ datasetList }) => <select>{
//   datasetList.map(
//     (dataset, i) => <option key={dataset.type + i}>{path(['source', 'title'], dataset)}</option>
//   )
// }</select>

// const PureApp = ({ datasetList, requestDatasetList }) =>
//   <div>{datasetList.map(dataset => <DatasetCard heading={path(['source','title'], dataset)} />)}</div>

// export default compose(
//   connect(
//     state => ({ datasetList: datasetListSelector(state) }), //mapStateToProps
//     { requestDatasetList } //mapDispatchToProps
//   ),
//   withPropsLog(),
//   withMountFn('requestDatasetList', 'ricette')
// )(DatasetSelect)