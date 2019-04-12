import React from "react";
import { connect } from "react-redux";
import { FormGroup, MenuItem, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { organizationsSelector } from "../duck/saveDatasetDuck";
import SuggestField from "./SuggestField";

const renderInputItem = (item /* update with : T */): string => item;

const logItem = item => console.log("[SuggestField] selected", item);

const renderItem = (item, itemProps) => {
  // update with => : ItemRenderer<T>
  const {
    handleClick,
    index,
    modifiers: { active, disabled, matchesPredicate },
    query
  } = itemProps;

  return (
    matchesPredicate && (
      <MenuItem
        shouldDismissPopover={false}
        onClick={handleClick}
        text={item}
      />
    )
  );
};

const filterItem = (
  // update with => : ItemPredicate<T>
  query,
  item,
  index,
  exactMatch?
) => {
  const normalizedData = item.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  return exactMatch
    ? normalizedData === normalizedQuery
    : normalizedData.indexOf(normalizedQuery) >= 0;
};

const OrganizationsSuggest = ({ organizations }) => (
  <FormGroup
    label="Dataset's Organization"
    labelFor="save_dataset_organization"
    labelInfo="*"
  >
    <SuggestField
      items={organizations}
      itemRenderer={renderItem}
      itemPredicate={filterItem}
      inputValueRenderer={renderInputItem}
      // onItemSelect={organization => null}
      defaultSelectedItem={organizations[0]}
      inputProps={{
        id: "save_dataset_organization",
        name: "save_dataset_organization",
        leftIcon: IconNames.DIAGRAM_TREE,
        required: true
      }}
      popoverProps={{
        position: Position.LEFT,
        targetProps: { style: { width: "100%" } }
      }}
    />
  </FormGroup>
);

const OrganizationsSuggestContainer = connect(
  state => ({ ...organizationsSelector(state) }),
  {}
)(OrganizationsSuggest);

export default OrganizationsSuggestContainer;
