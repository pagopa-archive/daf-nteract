/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/no-noninteractive-tabindex: 0 */

/**
 * Plan:
 *
 * Create a 1-dimensional grid of new notebook types for clicking
 * to create new notebooks
 *
 * Create a listing of running notebooks
 * Showcase the directory navigator
 */

import { AppState, KernelspecProps, KernelspecRecord } from "@nteract/types";
import * as Immutable from "immutable";
import * as React from "react";
import { connect } from "react-redux";
import styled, { StyledComponent } from "styled-components";

import { default as Logo } from "./logos";

export interface AvailableNotebook {
  kernelspec: KernelspecRecord | KernelspecProps;
}

export type AvailableNotebooks =
  | AvailableNotebook[]
  | Immutable.List<AvailableNotebook>;

const DisplayNameLong = styled.p`
  margin: 0;
  color: var(--theme-primary-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NewNotebookDiv = styled.div`
  color: var(--nt-color-midnight-light);
  cursor: pointer;

  font-family: var(--nt-font-family-normal);
  color: var(--nt-color-midnight-light);
  margin: 20px 20px 0 0;
  flex: 0 0 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 150px;
  width: 100px;

  a {
    padding-top: 20px;
  }

  :hover {
    box-shadow: var(--theme-primary-shadow-hover);
    & ${DisplayNameLong} {
      white-space: initial;
      overflow: initial;
      text-overflow: initial;
    }
  }

  :focus {
    box-shadow: var(--theme-primary-shadow-focus);
    & ${DisplayNameLong} {
      white-space: initial;
      overflow: initial;
      text-overflow: initial;
    }
  }
`;

const LogoBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  background-color: var(--theme-app-bg, white);
  flex: 1;

  .logo {
    width: 2em;
    box-sizing: border-box;
    margin: 0 auto;
  }
`;

const TextBox = styled.div`
  padding: 8px 6px 8px 6px;
  font-size: 0.8em;
  width: 100px;
  box-sizing: border-box;
  background-color: var(--theme-primary-bg, hsl(0, 0%, 98%));
  border-top: 1px solid var(--theme-app-border);
`;

const DisplayNameShort = styled.p`
  text-transform: capitalize;
  margin: 0 5px 0 0;
  font-weight: 600;
  color: var(--theme-app-fg);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const NewNotebook = (
  props: AvailableNotebook & {
    href?: string;
    onClick?: (ks: KernelspecRecord | KernelspecProps) => void;
  }
) => {
  const onClick = () => {
    if (props.onClick) {
      props.onClick(props.kernelspec);
    }
  };

  return (
    <NewNotebookDiv tabIndex={0} onClick={onClick}>
      <LogoBox>
        <div className="logo">
          <Logo language={props.kernelspec.language} />
        </div>
      </LogoBox>
      <TextBox>
        <DisplayNameShort title={props.kernelspec.language}>
          {props.kernelspec.language}
        </DisplayNameShort>
        <DisplayNameLong title={props.kernelspec.displayName}>
          {props.kernelspec.displayName}
        </DisplayNameLong>
      </TextBox>
    </NewNotebookDiv>
  );
};

NewNotebook.defaultProps = {
  onClick: () => {}
};

const NotebookCollection = styled.div`
  padding: 0 0 20px 0;
  box-sizing: border-box;
  min-width: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
`;

const Banner = styled.div`
  background-color: var(--nt-color-grey-light);
  color: var(--nt-color-midnight);

  box-sizing: border-box;

  width: 100vw;
  padding-top: 20px;
  padding-left: 20px;
`;

export const PureNewNotebookNavigation = (props: {
  availableNotebooks: AvailableNotebooks;
  onClick?: (ks: KernelspecRecord | KernelspecProps) => void;
}) => (
  <Banner>
    <div>Start a new notebook</div>
    <NotebookCollection>
      {(props.availableNotebooks as AvailableNotebook[]).map(
        (an: AvailableNotebook) => (
          <NewNotebook
            kernelspec={an.kernelspec}
            key={an.kernelspec.name}
            onClick={props.onClick}
          />
        )
      )}
    </NotebookCollection>
  </Banner>
);

const makeMapStateToProps = (initialState: AppState) => {
  let cachedAvailableKernels = Immutable.List();

  // To know whether we need to cache a new value
  const previousKernelspecs = initialState.core.entities.kernelspecs;

  const mapStateToProps = (state: AppState) => {
    if (previousKernelspecs !== state.core.entities.kernelspecs) {
      const availableKernels = state.core.entities.kernelspecs.byRef
        .flatMap(kss => {
          return kss.byName.map(ks => {
            return { kernelspec: ks };
          });
        })
        .sort((a, b) => {
          const langCompare = a.kernelspec.language.localeCompare(
            b.kernelspec.language
          );
          const displayCompare = a.kernelspec.displayName.localeCompare(
            b.kernelspec.displayName
          );

          // Effectively, group by language then sort by display name within
          const comparison = langCompare > 0 ? displayCompare : langCompare;

          return comparison;
        })
        .toList();

      cachedAvailableKernels = availableKernels;
    }

    return {
      availableNotebooks: cachedAvailableKernels
    };
  };
  return mapStateToProps;
};

export const NewNotebookNavigation = connect(makeMapStateToProps)(
  PureNewNotebookNavigation
);

export default NewNotebookNavigation;
