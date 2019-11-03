/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */

import {
  DropdownContent,
  DropdownMenu,
  DropdownTrigger
} from "@nteract/dropdown-menu";
import {
  ChevronDownOcticon,
  TrashOcticon,
  TriangleRightOcticon
} from "@nteract/octicons";
import { ContentRef } from "@nteract/types";
import * as React from "react";

import styled, { StyledComponent } from "styled-components";

import { CellType } from "@nteract/commutable";

import SelectDataset from "../../pdnd-nteract-packages/select-dataset";
import SaveDataset from "../../pdnd-nteract-packages/save-dataset";

export interface PureToolbarProps {
  type: CellType;
  executeCell: () => void;
  deleteCell: () => void;
  clearOutputs: () => void;
  toggleParameterCell: () => void;
  toggleCellInputVisibility: () => void;
  toggleCellOutputVisibility: () => void;
  toggleOutputExpansion: () => void;
  changeCellType: () => void;
  cellFocused: boolean;
  sourceHidden: boolean;
}

export const CellToolbar = styled.div`
  background-color: var(--theme-cell-toolbar-bg);
  opacity: 0.4;
  transition: opacity 0.4s;

  & > div {
    display: inline-block;
  }

  :hover {
    opacity: 1;
  }

  @media print {
    display: none;
  }

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

  span {
    font-size: 15px;
    line-height: 1;
    color: var(--theme-cell-toolbar-fg);
  }

  button span:hover {
    color: var(--theme-cell-toolbar-fg-hover);
  }

  .octicon {
    transition: color 0.5s;
  }

  span.spacer {
    display: inline-block;
    vertical-align: middle;
    margin: 1px 5px 3px 5px;
    height: 11px;
  }
`;

interface CellToolbarMaskProps {
  sourceHidden: boolean;
  cellFocused: boolean;
}

export const CellToolbarMask = styled.div.attrs<CellToolbarMaskProps>(
  props => ({
    style: {
      display: props.cellFocused
        ? "block"
        : props.sourceHidden
        ? "block"
        : "none"
    }
  })
)`
  z-index: 9;
  position: sticky; /* keep visible with large code cells that need scrolling */
  float: right;
  top: 0;
  right: 0;
  height: 34px;
  margin: 0 0 0 -100%; /* allow code cell to completely overlap (underlap?) */
  padding: 0 0 0 50px; /* give users extra room to move their mouse to the
                          toolbar without causing the cell to go out of
                          focus/hide the toolbar before they get there */
` as StyledComponent<"div", any, CellToolbarMaskProps, never>;

export class PureToolbar extends React.PureComponent<PureToolbarProps> {
  static defaultProps: Partial<PureToolbarProps> = {
    type: "code"
  };

  render(): JSX.Element {
    const { executeCell, deleteCell, sourceHidden } = this.props;

    return (
      <CellToolbarMask
        sourceHidden={sourceHidden}
        cellFocused={this.props.cellFocused}
      >
        <CellToolbar>
          {this.props.type !== "markdown" && (
            <button
              onClick={executeCell}
              title="execute cell"
              className="executeButton"
            >
              <span className="octicon">
                <TriangleRightOcticon />
              </span>
            </button>
          )}
          <SelectDataset />
          <SaveDataset />
          <DropdownMenu>
            <DropdownTrigger>
              <button title="show additional actions">
                <span className="octicon toggle-menu">
                  <ChevronDownOcticon />
                </span>
              </button>
            </DropdownTrigger>
            {this.props.type === "code" ? (
              <DropdownContent>
                <li
                  onClick={this.props.clearOutputs}
                  className="clearOutput"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Clear Cell Output</a>
                </li>
                <li
                  onClick={this.props.toggleCellInputVisibility}
                  className="inputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Input Visibility</a>
                </li>
                <li
                  onClick={this.props.toggleCellOutputVisibility}
                  className="outputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Output Visibility</a>
                </li>
                <li
                  onClick={this.props.toggleOutputExpansion}
                  className="outputExpanded"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Expanded Output</a>
                </li>
                <li
                  onClick={this.props.toggleParameterCell}
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Toggle Parameter Cell</a>
                </li>

                <li
                  onClick={this.props.changeCellType}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Convert to Markdown Cell</a>
                </li>
              </DropdownContent>
            ) : (
              <DropdownContent>
                <li
                  onClick={this.props.changeCellType}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                >
                  <a>Convert to Code Cell</a>
                </li>
              </DropdownContent>
            )}
          </DropdownMenu>
          <span className="spacer" />
          <button
            onClick={deleteCell}
            title="delete cell"
            className="deleteButton"
          >
            <span className="octicon">
              <TrashOcticon />
            </span>
          </button>
        </CellToolbar>
      </CellToolbarMask>
    );
  }
}

export default PureToolbar;
