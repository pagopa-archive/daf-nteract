import React from "react";
import { Button, Popover, Classes, Position } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import DatasetListContainer from "./src/DatasetListContainer";
import "./styles.css";

const DatasetPopover = (props: any): JSX.Element => (
  <Popover
    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
    position={Position.BOTTOM_RIGHT}
    defaultIsOpen={false}
    captureDismiss={false}
    lazy={true}
    content={<DatasetListContainer {...props} />}
    target={<Button minimal small icon={IconNames.SEARCH_TEMPLATE} />}
  />
);

export default DatasetPopover;
