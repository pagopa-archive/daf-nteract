import React from 'react'

import { Button, MenuItem } from "@blueprintjs/core";
import { Select, Suggest, ItemRenderer, ItemPredicate } from "@blueprintjs/select";

import { IDatasetItem } from '../types'
import { selectDataset } from '../../daf-actions';

const renderDatasetItem: ItemRenderer<IDatasetItem> = (
  { id, modified, name, notes, organization, theme, title },
  { handleClick, modifiers }
) => {
    return modifiers.matchesPredicate ? (
      <MenuItem
        // active={true}
        key={id}
        label={"label"}
        onClick={handleClick}
        text={title}
      />
    ) :
    null
  }

const filterDatasetItem: ItemPredicate<IDatasetItem> = (query, dataset) => true

// const handleValueChange = (dataset: IDatasetItem) => console.log(dataset)
  
const DatasetSelect = Select.ofType<IDatasetItem>()
  
const DatasetListSelect = ({ datasetList }) => <DatasetSelect
  items={datasetList}
  itemRenderer={renderDatasetItem}
  itemPredicate={filterDatasetItem}
  onItemSelect={handleValueChange}
>
  <Button text="Pick dataset" />
</DatasetSelect>

const datasetValueRender = ({title}: IDatasetItem) => title

const DatasetSuggest = Suggest.ofType<IDatasetItem>()

const DatasetListSuggest = ({ datasetList, selectDataset }) => <DatasetSuggest
  items={datasetList}
  itemRenderer={renderDatasetItem}
  inputValueRenderer={datasetValueRender}
  onItemSelect={(dataset: IDatasetItem) => selectDataset(dataset)}
/>

export default DatasetListSuggest