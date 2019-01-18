import { Map, List } from 'immutable';
import { AppRecord, CommsRecord, ConfigState, CoreRecord } from "../../types/src";

// import datasetListReducer from './duck'

// type DatasetsListMetaProps =
//   Map<string, { isLoading: boolean, hasLoaded: boolean, error: boolean }>

// type DatasetsList = Map<string, { data: List<any>, meta: DatasetListMetaProps }>

type DatasetList = Map<string, any>

export type DafState = { datasetList: DatasetList, selectedDataset: string }

export const makeDafState = (): DafState => ({
  'datasetList': Map({
    data: List(),
    meta: Map({
      isLoading: false,
      hasLoaded: false,
      error: false
    })
  }),
  'selectedDataset': ""
})

export type DafAppState = {
  app: AppRecord;
  comms: CommsRecord;
  config: ConfigState;
  core: CoreRecord;
  daf: DafState;
}