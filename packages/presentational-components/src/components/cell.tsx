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

/**
 * 
 * 
 // The following needs to be done using https://www.styled-components.com/docs/advanced#referring-to-other-components

 // These styles need to be done in <Prompt />

        .cell.overrideHover :global(.prompt),
        .cell:hover :global(.prompt),
        .cell:active :global(.prompt) {
          background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
          color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));
        }

        .cell:focus :global(.prompt),
        .cell.focused :global(.prompt) {
          background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
          color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
        }

// These styles need to be done in outputs

        .cell.focused :global(.outputs) {
          overflow-y: auto;
        }

 * 
 * 
 */

export const OriginalCell = (props: CellProps) => {
  const children = props.children;

  return (
    <div
      className={`cell ${props.isSelected ? "focused" : ""} ${
        props._hovered ? "overrideHover" : ""
      }`}
    >
      <style jsx>{`
        .cell {
          position: relative;
          background: var(--theme-cell-bg, white);
          transition: all 0.1s ease-in-out;
        }

        .cell.overrideHover,
        .cell:hover {
          box-shadow: var(
            --theme-cell-shadow-hover,
            1px 1px 3px rgba(0, 0, 0, 0.12),
            -1px -1px 3px rgba(0, 0, 0, 0.12)
          );
        }

        .cell.focused {
          box-shadow: var(
            --theme-cell-shadow-focus,
            3px 3px 9px rgba(0, 0, 0, 0.12),
            -3px -3px 9px rgba(0, 0, 0, 0.12)
          );
        }

        .cell.overrideHover :global(.prompt),
        .cell:hover :global(.prompt),
        .cell:active :global(.prompt) {
          background-color: var(--theme-cell-prompt-bg-hover, hsl(0, 0%, 94%));
          color: var(--theme-cell-prompt-fg-hover, hsl(0, 0%, 15%));
        }

        .cell:focus :global(.prompt),
        .cell.focused :global(.prompt) {
          background-color: var(--theme-cell-prompt-bg-focus, hsl(0, 0%, 90%));
          color: var(--theme-cell-prompt-fg-focus, hsl(0, 0%, 51%));
        }

        .cell.focused :global(.outputs) {
          overflow-y: auto;
        }
      `}</style>
      {children}
    </div>
  );
};

Cell.defaultProps = {
  isSelected: false,
  _hovered: false,
  children: null
};
