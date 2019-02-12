import React, { SyntheticEvent, Fragment } from "react";

import {
  MenuItem,
  InputGroup,
  Spinner,
  Classes,
  FormGroup,
  Tag,
  Button,
  Intent,
  H3,
  Icon
} from "@blueprintjs/core";
import {
  Select,
  Suggest,
  ItemRenderer,
  ItemPredicate
} from "@blueprintjs/select";

import { IDatasetItem } from "../types";
import { INPUT, INTENT_DANGER } from "@blueprintjs/core/lib/esm/common/classes";
import { IconNames } from "@blueprintjs/icons";

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
      labelElement={
        <a
          target="_blank"
          href={"https://dataportal.daf.teamdigitale.it/#/dataset/" + name}
        >
          <Button
            small
            minimal
            intent={Intent.PRIMARY}
            rightIcon={IconNames.LINK}
          />
        </a>
      }
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

// const DatasetListSuggest = ({
//   datasetList,
//   requestDataset,
//   requestDatasetList,
//   isLoading,
//   hasLoaded
// }) => (
//   <>
//     <H4 style={{ color: "hsl(210, 100%, 40%)" }}>DAF Dataset Loader</H4>
//     <FormGroup
//       helperText="Please enter a value"
//       label="Search Dataset"
//       labelFor="search-dataset"
//       labelInfo="*"
//     >
//       <InputGroup
//         id="search-dataset"
//         // className={Classes.FILL}
//         large={true}
//         placeholder="turismo"
//         leftIcon={IconNames.SEARCH}
//         // rightElement={
//         //   isLoading ? (
//         //     <Spinner />
//         //   ) : (
//         //     hasLoaded && (
//         //       <Tag
//         //         intent={datasetList.length > 0 ? "success" : "danger"}
//         //         minimal={true}
//         //       >
//         //         {datasetList.length}
//         //       </Tag>
//         //     )
//         //   )
//         // }
//         onChange={(e: SyntheticEvent) => requestDatasetList(e.target.value)}
//       />
//     </FormGroup>

//     {isLoading ? (
//       <Spinner />
//     ) : datasetList.length < 1 ? (
//       <NonIdealState
//         icon="search"
//         title="No search results"
//         description={
//           "Your search did not match any dataset.\n Try searching for something else."
//         }
//       />
//     ) : (
//       <DatasetSuggest
//         inputProps={{
//           id: "filter-dataset-list",
//           placeholder: "turismo",
//           leftIcon: IconNames.FILTER_LIST,
//           large: true,
//           className: Classes.FILL
//         }}
//         items={datasetList}
//         itemRenderer={renderDatasetItem}
//         itemPredicate={filterDatasetItem}
//         inputValueRenderer={datasetValueRender}
//         onItemSelect={({ name }: IDatasetItem) => requestDataset(name)}
//       />
//     )}
//   </>
// );

const DatasetListSuggest = ({
  datasetList,
  requestDataset,
  requestDatasetList,
  isLoading,
  hasLoaded,
  error
}) => {
  return (
    <Fragment>
      <H3 style={{ color: "hsl(210, 100%, 40%)" }}>DAF Dataset Loader</H3>
      <FormGroup
        // helperText="Please enter a value"
        label="Search Dataset"
        labelFor="search-dataset"
        // labelInfo="*"
      >
        <InputGroup
          onChange={(e: SyntheticEvent) => requestDatasetList(e.target.value)}
          id="search-dataset"
          // className={Classes.FILL}
          intent={
            hasLoaded || isLoading || error
              ? datasetList.length > 0
                ? Intent.SUCCESS
                : Intent.DANGER
              : Intent.NONE
          }
          large={true}
          placeholder="turismo"
          leftIcon={IconNames.SEARCH}
          rightElement={
            hasLoaded || isLoading || error ? (
              <Tag minimal>
                {datasetList.length < 1 ? (
                  <Icon intent={Intent.DANGER} icon={IconNames.CROSS} />
                ) : hasLoaded ? (
                  <Icon intent={Intent.SUCCESS} icon={IconNames.TICK} />
                ) : (
                  <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
                )}
              </Tag>
            ) : (
              undefined
            )
          }
        />
      </FormGroup>
      <FormGroup
        // helperText="Please enter a value"
        label="Filter and Select Dataset"
        labelFor="select-dataset-list"
      >
        <DatasetSuggest
          inputProps={{
            id: "select-dataset-list",
            className: Classes.FILL,
            large: true,
            placeholder: "turismo",
            leftIcon: IconNames.FILTER_LIST,
            disabled: !hasLoaded || error || datasetList.length < 1
          }}
          items={datasetList}
          itemRenderer={renderDatasetItem}
          itemPredicate={filterDatasetItem}
          inputValueRenderer={datasetValueRender}
          onItemSelect={({ name }: IDatasetItem) => requestDataset(name)}
        />
      </FormGroup>
    </Fragment>
  );
};

export default DatasetListSuggest;
