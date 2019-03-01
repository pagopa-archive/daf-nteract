import { Map, List } from "immutable";

interface DafState {
  datasetList: Map<string, any>;
  selectedDataset: Map<string, any>;
  loggedUser: Map<string, any>;
}

const makeDafState = (): DafState => ({
  datasetList: Map({
    data: List(),
    meta: Map({
      isLoading: false,
      hasLoaded: false,
      error: false
    })
  }),
  selectedDataset: Map({
    data: Map(),
    meta: Map({
      datasetName: "",
      isLoading: false,
      hasLoaded: false,
      error: false
    })
  }),
  loggedUser: Map({
    data: Map(),
    meta: Map({
      isLoading: false,
      hasLoaded: false,
      error: false
    })
  })
});

export { DafState, makeDafState };
