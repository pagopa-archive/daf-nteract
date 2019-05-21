import * as actions from "@nteract/actions";
import { CellType } from "@nteract/commutable";
import { CodeOcticon, MarkdownOcticon } from "@nteract/octicons";
import { ContentRef } from "@nteract/types";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import styled from "styled-components";

interface Props {
  above: boolean;
  createCell: (type: "code" | "markdown") => void;
}

interface ConnectedProps {
  above: boolean;
  createCellAppend: (
    payload: { cellType: CellType; contentRef: ContentRef }
  ) => void;
  createCellAbove: (
    payload: {
      cellType: CellType;
      id?: string;
      contentRef: ContentRef;
    }
  ) => void;
  createCellBelow: (
    payload: {
      cellType: CellType;
      id?: string;
      source: string;
      contentRef: ContentRef;
    }
  ) => void;
  id?: string;
  contentRef: ContentRef;
}

export const CellCreatorMenu = styled.div`
  display: none;
  background: var(--theme-cell-creator-bg);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  pointer-events: all;
  position: relative;
  top: -5px;

  button {
    display: inline-block;

    width: 22px;
    height: 20px;
    padding: 0px 4px;

    text-align: center;

    border: none;
    outline: none;
    background: none;
  }

  button span {
    font-size: 15px;
    line-height: 1;

    color: var(--theme-cell-creator-fg);
  }

  button span:hover {
    color: var(--theme-cell-creator-fg-hover);
  }

  .octicon {
    transition: color 0.5s;
  }
`;

const CreatorHoverMask = styled.div`
  display: block;
  position: relative;
  overflow: visible;
  height: 0px;

  @media print{
    display: none;
  }
`;
const CreatorHoverRegion = styled.div`
  position: relative;
  overflow: visible;
  top: -10px;
  height: 60px;
  text-align: center;

  &:hover ${CellCreatorMenu} {
    display: inline-block;
  }
`;

export class PureCellCreator extends React.PureComponent<Props> {
  createMarkdownCell = () => {
    this.props.createCell("markdown");
  };

  createCodeCell = () => {
    this.props.createCell("code");
  };

  render() {
    return (
      <CreatorHoverMask>
        <CreatorHoverRegion>
          <CellCreatorMenu>
            <button
              onClick={this.createMarkdownCell}
              title="create text cell"
              className="add-text-cell"
            >
              <span className="octicon">
                <MarkdownOcticon />
              </span>
            </button>
            <button
              onClick={this.createCodeCell}
              title="create code cell"
              className="add-code-cell"
            >
              <span className="octicon">
                <CodeOcticon />
              </span>
            </button>
          </CellCreatorMenu>
        </CreatorHoverRegion>
      </CreatorHoverMask>
    );
  }
}

// tslint:disable max-classes-per-file
class CellCreator extends React.PureComponent<ConnectedProps> {
  createCell = (type: "code" | "markdown"): void => {
    const {
      above,
      createCellBelow,
      createCellAppend,
      createCellAbove,
      id,
      contentRef
    } = this.props;

    if (id === undefined || typeof id !== "string") {
      createCellAppend({ cellType: type, contentRef });
      return;
    }

    above
      ? createCellAbove({ cellType: type, id, contentRef })
      : createCellBelow({ cellType: type, id, source: "", contentRef });
  };

  render() {
    return (
      <PureCellCreator above={this.props.above} createCell={this.createCell} />
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createCellAbove: (payload: {
    cellType: CellType;
    id?: string;
    contentRef: ContentRef;
  }) => dispatch(actions.createCellAbove(payload)),
  createCellAppend: (payload: { cellType: CellType; contentRef: ContentRef }) =>
    dispatch(actions.createCellAppend(payload)),
  createCellBelow: (payload: {
    cellType: CellType;
    id?: string;
    source: string;
    contentRef: ContentRef;
  }) => dispatch(actions.createCellBelow(payload))
});

export default connect(
  null,
  mapDispatchToProps
)(CellCreator);
