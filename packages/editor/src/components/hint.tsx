import * as React from "react";
import styled, { StyledComponent } from "styled-components";

interface TypeIconProps {
  type?:
    | "module"
    | "keyword"
    | "statement"
    | "function"
    | "instance"
    | "null"
    | "class"
    | string; // Allow others we may not support yet
}

interface HintProps {
  text: string;
  type?: TypeIconProps["type"];
  displayText?: string;
  [other: string]: any;
}

// Completion to us, "hint" to codemirror
export function Hint(props: HintProps): JSX.Element {
  return (
    <React.Fragment>
      {props.type ? <TypeIcon type={props.type} /> : null}
      {props.displayText || props.text}
    </React.Fragment>
  );
}

/**
 * An Icon to show before a code hint to show the type
 * (e.g. Module, Keyword, etc.)
 */
export const TypeIcon: StyledComponent<
  "span",
  any,
  TypeIconProps
> = styled.span.attrs<TypeIconProps>(props => ({
  className: `completion-type-${props.type}`,
  title: props.type
}))`
  & {
    background: transparent;
    border: transparent 1px solid;
    width: 17px;
    height: 17px;
    margin: 0;
    padding: 0;
    display: inline-block;
    margin-right: 5px;
    top: 18px;
  }

  &:before {
    /* When experimental type completion isn't available render the left side as "nothing" */
    content: " ";
    bottom: 1px;
    left: 4px;
    position: relative;
    color: white;
  }
  /* color and content for each type of completion */
  &.completion-type-keyword:before {
    content: "K";
  }
  &.completion-type-keyword {
    background-color: darkred;
  }
  &.completion-type-class:before {
    content: "C";
  }
  &.completion-type-class {
    background-color: blueviolet;
  }
  &.completion-type-module:before {
    content: "M";
  }
  &.completion-type-module {
    background-color: chocolate;
  }
  &.completion-type-statement:before {
    content: "S";
  }
  &.completion-type-statement {
    background-color: forestgreen;
  }
  &.completion-type-function:before {
    content: "ƒ";
  }
  &.completion-type-function {
    background-color: yellowgreen;
  }
  &.completion-type-instance:before {
    content: "I";
  }
  &.completion-type-instance {
    background-color: teal;
  }
  &.completion-type-null:before {
    content: "ø";
  }
  &.completion-type-null {
    background-color: black;
  }
`; // Somehow setting the type on `attrs` isn't propagating properly
