import React, { SyntheticEvent, Fragment } from "react";
import {
  Menu,
  MenuItem,
  InputGroup,
  Spinner,
  FormGroup,
  Tag,
  Button,
  Intent,
  H3,
  Icon,
  Position,
  Classes
} from "@blueprintjs/core";
import { Suggest, ItemRenderer, ItemPredicate, renderFilteredItems } from "@blueprintjs/select";
import { IconNames } from "@blueprintjs/icons";

import { highlightText } from "./highlightUtil";
import { IDatasetItem } from "../types";

const renderDatasetItem: ItemRenderer<IDatasetItem> = (
  { name, title }: IDatasetItem,
  { handleClick, modifiers, query }
): JSX.Element | null => {
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
  ) : null; // try && instead of testcase ? truecase : falsecase
};

const filterDatasetItem: ItemPredicate<IDatasetItem> = (
  query: string,
  value: IDatasetItem
): boolean => value.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;

const datasetInputRender = ({ title }: IDatasetItem): string => title;

const DatasetSuggest = Suggest.ofType<IDatasetItem>();

const DatasetListSuggest = ({
  datasetList,
  requestDataset,
  requestDatasetList,
  isLoading,
  hasLoaded,
  error
}): JSX.Element => (
  <Fragment>
    <H3 style={{ color: "hsl(210, 100%, 40%)" }}>PDND Load Dataset</H3>
    <FormGroup
      // helperText="Please enter a value"
      label="Search Dataset"
      labelFor="search-dataset"
      // labelInfo="*"
    >
      <InputGroup
        onChange={(e: SyntheticEvent) => requestDatasetList(e.target.value)}
        id="search-dataset"
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
          disabled: !hasLoaded || error || datasetList.length < 1,
          intent:
            !hasLoaded || error || datasetList.length < 1
              ? Intent.NONE
              : Intent.SUCCESS
        }}
        popoverProps={{
          position: Position.BOTTOM_LEFT
        }}
        items={datasetList}
        itemRenderer={renderDatasetItem}
        // itemListRenderer={itemListProps => <Menu>{renderFilteredItems(itemListProps)}</Menu>}
        itemPredicate={filterDatasetItem}
        inputValueRenderer={datasetInputRender}
        onItemSelect={({ name }: IDatasetItem) => requestDataset(name)}
      />
    </FormGroup>
  </Fragment>
);

export default DatasetListSuggest;
