import React, { Fragment, PureComponent, SyntheticEvent } from "react";
import {
  Button,
  Classes,
  Popover,
  Position
} from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

import "./styles.css";
import DafDatasetListSelect from "../daf-dataset-list";

const DafDatasetSearch = ({ isLoading, hasLoaded, error }) => (
  <Popover
    popoverClassName={Classes.POPOVER_CONTENT_SIZING}
    position={Position.BOTTOM_RIGHT}
    defaultIsOpen={false}
    captureDismiss={false}
    lazy={true}
    content={<DafDatasetListSelect />}
    target={
      <Button
        minimal
        small
        icon={IconNames.SEARCH_TEMPLATE}
        // intent={Intent.PRIMARY}
      />
    }
  />
);

export default DafDatasetSearch;
