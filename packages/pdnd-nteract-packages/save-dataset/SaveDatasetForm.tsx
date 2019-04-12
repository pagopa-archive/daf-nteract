import React, {
  FunctionComponent,
  FormHTMLAttributes,
  CSSProperties,
  SyntheticEvent
} from "react";
import { Intent, Button, H3, Classes } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import FormField from "./components/FormField";
import ThemesSuggest from "./components/ThemesSuggest";
import OrganizationsSuggest from "./components/OrganizationsSuggest";

const getIntentFromError = hasError => (hasError ? Intent.DANGER : Intent.NONE);

const SaveDatasetForm: FunctionComponent<
  FormHTMLAttributes<HTMLFormElement> & {
    requestDatasetSave: Function;
    hasError?: boolean;
    rowStyle?: CSSProperties;
  }
> = ({
  requestDatasetSave,
  hasError = false,
  rowStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  }
}) => {
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const idPrefix = "save_dataset_";
    const data = [
      ...new FormData(e.target as HTMLFormElement).entries()
    ].reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key.replace(idPrefix, "")]: value
      }),
      {}
    );
    return requestDatasetSave(data);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div style={rowStyle}>
        <H3 style={{ color: "hsl(210, 100%, 40%)" }}>Pdnd Dataset Saver</H3>
        <Button
          intent={Intent.PRIMARY}
          icon={IconNames.FLOPPY_DISK}
          type="submit"
          className={Classes.POPOVER_DISMISS}
          text="Save"
        />
      </div>
      <FormField
        helperText="Please enter the cell's variable that contains"
        label="Dataset Cell's Variable"
        labelFor="save_dataset_variable"
        labelInfo="*"
        // intent={}
        leftIcon={IconNames.VARIABLE}
        placeholder="data"
        required
      />
      <FormField
        helperText="Please enter a value"
        label="Dataset's Name"
        labelFor="save_dataset_name"
        labelInfo="*"
        // intent={}
        leftIcon={IconNames.NEW_TEXT_BOX}
        type="text"
        placeholder="Ricette tradizionali trentine"
        required
      />
      <FormField
        helperText="Please enter a value"
        label="Dataset's Description"
        labelFor="save_dataset_description"
        labelInfo="*"
        // intent={}
        leftIcon={IconNames.COMMENT}
        type="text"
        placeholder="Ricette antiche provenienti dalle.."
        required
      />
      <div style={rowStyle}>
        {/* <FormField
        label="Dataset's Theme"
        labelFor="save_dataset_theme"
        labelInfo="*"
        leftIcon={IconNames.LIST}
        placeholder="Tema1"
        required
        formGroupProps={{
          style: { marginRight: "15px" }
        }}
      /> */}

        {/* <FormField
        label="Dataset's Subtheme"
        labelFor="save_dataset_subtheme"
        labelInfo="*"
        leftIcon={IconNames.LIST_COLUMNS}
        type="text"
        placeholder="Sottotema1"
        required
      /> */}

        <ThemesSuggest />
      </div>

      {/* <FormField
      // helperText="Please enter a value"
      label="Dataset's Organization"
      labelFor="save_dataset_organization"
      labelInfo="*"
      // intent={error ? DANGER : NONE}
      leftIcon={IconNames.DIAGRAM_TREE}
      placeholder="Anagrafe.."
      required
    /> */}

      <OrganizationsSuggest />
    </form>
  );
};

export default SaveDatasetForm;
