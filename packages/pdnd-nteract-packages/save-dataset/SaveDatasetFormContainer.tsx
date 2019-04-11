import React, { FunctionComponent, FormEventHandler } from "react";
import { connect } from "react-redux";
import { Button, Popover, Classes, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import SaveDatasetForm from "./SaveDatasetForm";
import { isEditorOrAdmin, requestDatasetSave } from "./duck/saveDatasetDuck";
// import "./styles.css";

type SaveDatasetProps = {
  isEditorOrAdmin: boolean;
  requestDatasetSave: Function;
};

const SaveDataset: FunctionComponent<SaveDatasetProps> = ({
  isEditorOrAdmin,
  requestDatasetSave
}) =>
  isEditorOrAdmin && (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      position={Position.BOTTOM_RIGHT}
      defaultIsOpen={false}
      captureDismiss={false}
      lazy={true}
      content={<SaveDatasetForm requestDatasetSave={requestDatasetSave} />}
      target={<Button minimal small icon={IconNames.FLOPPY_DISK} />}
    />
  );

const SaveDatasetContainer = connect(
  state => ({ ...isEditorOrAdmin(state) }),
  { requestDatasetSave }
)(SaveDataset);

export default SaveDatasetContainer;
