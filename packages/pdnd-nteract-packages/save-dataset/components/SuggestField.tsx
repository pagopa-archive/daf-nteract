import React from "react";
import { Suggest } from "@blueprintjs/select";

const SuggestWrapper = Suggest.ofType(); // update with => ofType<T>()

const SuggestField = ({
  items,
  itemRenderer,
  itemPredicate,
  inputValueRenderer,
  onItemSelect,
  selectedItem = undefined,
  defaultSelectedItem,
  popoverProps,
  inputProps
}) => (
  <SuggestWrapper
    items={items}
    itemRenderer={itemRenderer}
    itemPredicate={itemPredicate}
    inputValueRenderer={inputValueRenderer}
    onItemSelect={onItemSelect}
    selectedItem={selectedItem}
    defaultSelectedItem={defaultSelectedItem}
    inputProps={inputProps}
    popoverProps={popoverProps}
  />
);

export default SuggestField;
