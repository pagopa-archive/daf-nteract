import React from "react";

import { MenuItem, H5 } from "@blueprintjs/core";
import {
  Select,
  Suggest,
  ItemRenderer,
  ItemPredicate
} from "@blueprintjs/select";

import { IDatasetItem } from "../types";

const escapeRegExpChars = (value: string) =>
  value.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

const highlightText = (value: string, query: string) => {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [value];
  }
  const regexp = new RegExp(words.join("|"), "gi");
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(value);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = value.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(
      <strong key={lastIndex} style={{ color: "hsl(210, 100%, 40%)" }}>
        {match[0]}
      </strong>
    );
  }
  const rest = value.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
};

const renderDatasetItem: ItemRenderer<IDatasetItem> = (
  { modified, name, notes, owner_org, theme, title, privatex },
  { handleClick, modifiers, query }
) => {
  return modifiers.matchesPredicate ? (
    <MenuItem
      // active={true}
      // label={theme}
      onClick={handleClick}
      text={highlightText(title, query)}
    />
  ) : null;
};

const filterDatasetItem: ItemPredicate<IDatasetItem> = (query, value) =>
  value.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const DatasetSelect = Select.ofType<IDatasetItem>();

// const handleValueChange = (dataset: IDatasetItem) => console.log(dataset);

// const DatasetListSelect = ({ datasetList }) => <DatasetSelect
//   items={datasetList}
//   itemRenderer={renderDatasetItem}
//   itemPredicate={filterDatasetItem}
//   onItemSelect={handleValueChange}
// >
//   <Button text="Pick dataset" />
// </DatasetSelect>

const datasetValueRender = ({ title }: IDatasetItem) => title;

const DatasetSuggest = Suggest.ofType<IDatasetItem>();

const DatasetListSuggest = ({ datasetList, requestDataset }) => (
  <>
    <H5 style={{ color: "hsl(210, 100%, 40%)" }}>Select Dataset</H5>
    <DatasetSuggest
      items={datasetList}
      itemRenderer={renderDatasetItem}
      itemPredicate={filterDatasetItem}
      inputValueRenderer={datasetValueRender}
      onItemSelect={(dataset: IDatasetItem) => requestDataset(dataset.name)}
    />
  </>
);

export default DatasetListSuggest;
