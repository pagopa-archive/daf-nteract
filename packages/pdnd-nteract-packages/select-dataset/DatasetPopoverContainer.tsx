import React, { FunctionComponent } from "react";
import { connect } from "react-redux";
import { Button, Popover, Classes, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DatasetListContainer from "./src/DatasetListContainer";
import { isUserLogged } from "../login/duck/loginDuck";
import { IDatasetPopoverProps } from "./types";
import "./styles.css";

const DatasetPopover: FunctionComponent<IDatasetPopoverProps> = ({
  isUserLogged
}) =>
  isUserLogged && (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      position={Position.BOTTOM_RIGHT}
      defaultIsOpen={false}
      captureDismiss={false}
      lazy={true}
      content={<DatasetListContainer />} // may add {...props} ?
      target={<Button minimal small icon={IconNames.SEARCH_TEMPLATE} />}
    />
  );

const DatasetPopoverContainer = connect(
  state => ({ ...isUserLogged(state) }),
  null
)(DatasetPopover);

export default DatasetPopoverContainer;
