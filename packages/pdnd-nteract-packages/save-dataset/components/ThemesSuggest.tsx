import React, { Fragment, PureComponent } from "react";
import { FormGroup, MenuItem, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import SuggestField from "./SuggestField";
import themesMapping from "./themesMapping.mock";

const renderInputItem = (item /* update with : T */): string => item.code;

const logItem = item => console.log("[SuggestField] selected", item.label);

const renderItem = (item, itemProps) => {
  // update with => : ItemRenderer<T>
  const { code, label, subtheme } = item;
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
        labelElement={item.code}
        text={item.label}
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
  const normalizedData = item["label"].toLowerCase();
  const normalizedQuery = query.toLowerCase();

  return exactMatch
    ? normalizedData === normalizedQuery
    : normalizedData.indexOf(normalizedQuery) >= 0;
};

class ThemesSuggest extends PureComponent {
  constructor(props) {
    super(props);

    this.selectTheme = this.selectTheme.bind(this);
    this.selectSubtheme = this.selectSubtheme.bind(this);
  }

  state = {
    selectedTheme: { code: "AGRI", label: "", subthemes: [] },
    selectedSubtheme: null
  };

  selectTheme(selectedTheme) {
    // this.props.selectTheme(selectedThemeCode)
    this.setState({ selectedTheme, selectedSubtheme: null });
  }

  selectSubtheme(selectedSubtheme) {
    this.setState({ selectedSubtheme });
    // this.props.selectSubtheme(selectedSubtheme)
  }

  render() {
    const { selectTheme, selectSubtheme } = this;
    const {
      selectedTheme: { subthemes },
      selectedSubtheme
    } = this.state;

    // const { subthemes } = themesMapping.filter(
    //   (theme, i) => theme.code === selectedThemeCode
    // )[0];

    return (
      <Fragment>
        <FormGroup
          label="Dataset Theme"
          labelFor="save_dataset_theme"
          labelInfo="*"
          style={{ marginRight: "15px" }}
        >
          <SuggestField
            items={themesMapping}
            itemRenderer={renderItem}
            itemPredicate={filterItem}
            inputValueRenderer={renderInputItem}
            onItemSelect={theme => selectTheme(theme)}
            popoverProps={{
              position: Position.RIGHT
            }}
            inputProps={{
              id: "save_dataset_theme",
              name: "save_dataset_theme",
              leftIcon: IconNames.LIST,
              placeholder: "AGRI",
              required: true
            }}
          />
        </FormGroup>
        <FormGroup
          label="Dataset Subtheme"
          labelFor="save_dataset_subtheme"
          labelInfo="*"
        >
          <SuggestField
            items={subthemes}
            itemRenderer={renderItem}
            itemPredicate={filterItem}
            inputValueRenderer={renderInputItem}
            onItemSelect={subtheme => selectSubtheme(subtheme)}
            selectedItem={selectedSubtheme}
            popoverProps={{ position: Position.LEFT }}
            inputProps={{
              id: "save_dataset_subtheme",
              name: "save_dataset_subtheme",
              leftIcon: IconNames.LIST_COLUMNS,
              placeholder: "Produzione Agricola",
              required: true,
              disabled: subthemes.length === 0
            }}
          />
        </FormGroup>
      </Fragment>
    );
  }
}

export default ThemesSuggest;
