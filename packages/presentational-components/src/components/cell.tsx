import * as React from "react";

import styled from "styled-components";

import { Prompt } from "./prompt";

interface CellProps {
  /**
   * Indicates if a cell is selected
   */
  isSelected?: boolean;
  /**
   * Indicates if hovering over a cell
   */
  _hovered?: boolean;
  /**
   * Style children when a cell is selected or hovered over
   */
  children?: React.ReactNode;
}

// Note: no happy syntax highlighting if I include the generic
//
//   export const Cell2 = styled.div<CellProps>`
//

const levels = {
  FLAT: "none",
  HOVERED:
    "var(--theme-cell-shadow-hover, 1px 1px 3px rgba(0, 0, 0, 0.12), -1px -1px 3px rgba(0, 0, 0, 0.12) )",
  SELECTED:
    "var(--theme-cell-shadow-focus, 3px 3px 9px rgba(0, 0, 0, 0.12), -3px -3px 9px rgba(0, 0, 0, 0.12) )"
};

/** @component */
export const Cell = styled.div`
  & {
    position: relative;
    background: var(--theme-cell-bg, white);
    transition: all 0.1s ease-in-out;

    box-shadow: ${(props: CellProps) =>
      props.isSelected
        ? levels.SELECTED
        : props._hovered
        ? levels.HOVERED
        : levels.FLAT};
  }

  &:hover {
    box-shadow: ${(props: CellProps) =>
      // When selected, let that take precedence over hovered
      props.isSelected ? levels.SELECTED : levels.HOVERED};
  }

  /* 
  Our cells conditionally style the prompt contained within based on if the cell is 
  selected or hovered. To do this with styled-components (for other components) use
  their method of referring to other components like so: 
  
  https://www.styled-components.com/docs/advanced#referring-to-other-components
  
  */
  & ${Prompt} {
    ${props =>
      props.isSelected
        ? `
        background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
        color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
        `
        : props._hovered
        ? `
        background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
        color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));
        `
        : ``}
  }

  /** Left off needing to allow isSelected to take precedence over hover */

  &:hover ${Prompt}, &:active ${Prompt} {
    background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
    color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));
  }

  &:focus ${Prompt} {
    background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
    color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
  }
`;

Cell.displayName = "Cell";

Cell.defaultProps = {
  isSelected: false,
  _hovered: false,
  children: null
};
