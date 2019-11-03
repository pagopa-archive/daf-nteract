/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */

// react-hot-loader uses proxies to the original elements so we need to use
// their comparison function in case a consumer of these components is
// using hot module reloading
import * as React from "react";
import { areComponentsEqual } from "react-hot-loader";
import styled from "styled-components";

interface DropdownMenuProps {
  children: React.ReactNode;
}

interface DropdownMenuState {
  menuHidden: boolean;
}

const DropdownDiv = styled.div`
  z-index: 10000;
  display: inline-block;
`;

DropdownDiv.displayName = "DropdownDiv";

export class DropdownMenu extends React.PureComponent<
  DropdownMenuProps,
  DropdownMenuState
> {
  constructor(props: DropdownMenuProps) {
    super(props);
    this.state = {
      menuHidden: true
    };
  }

  render() {
    return (
      <DropdownDiv>
        {React.Children.map(this.props.children, child => {
          const childElement = child as React.ReactElement<any>;
          if (
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              DropdownTrigger
            )
          ) {
            return React.cloneElement(childElement, {
              onClick: () => {
                this.setState({ menuHidden: !this.state.menuHidden });
              }
            });
          } else if (
            areComponentsEqual(
              childElement.type as React.ComponentType<any>,
              DropdownContent
            )
          ) {
            if (this.state.menuHidden) {
              return null;
            } else {
              // DropdownContent child will pass down an onItemClick so that
              // the menu will collapse
              return React.cloneElement(childElement, {
                onItemClick: () => {
                  this.setState({ menuHidden: true });
                }
              });
            }
          } else {
            // fallback
            return child;
          }
        })}
      </DropdownDiv>
    );
  }
}

const DropdownTriggerDiv = styled.div`
  user-select: none;
  margin: 0px;
  padding: 0px;
`;

DropdownTriggerDiv.displayName = "DropdownTriggerDiv";

// tslint:disable max-classes-per-file
export class DropdownTrigger extends React.PureComponent<{
  children: React.ReactNode;
  onClick?: (ev: React.MouseEvent<HTMLElement>) => void;
}> {
  render() {
    return (
      <DropdownTriggerDiv onClick={this.props.onClick}>
        {this.props.children}
      </DropdownTriggerDiv>
    );
  }
}

const DropdownContentDiv = styled.div`
  user-select: none;
  margin: 0px;
  padding: 0px;

  width: 200px;

  opacity: 1;
  position: absolute;
  top: 0.2em;
  right: 0;
  border-style: none;
  padding: 0;
  font-family: var(--nt-font-family-normal);
  font-size: var(--nt-font-size-m);
  line-height: 1.5;
  margin: 20px 0;
  background-color: var(--theme-cell-menu-bg);

  ul {
    list-style: none;
    text-align: left;
    padding: 0;
    margin: 0;
    opacity: 1;
  }

  ul li {
    padding: 0.5rem;
  }

  ul li:hover {
    background-color: var(--theme-cell-menu-bg-hover, #e2dfe3);
    cursor: pointer;
  }
`;

DropdownContentDiv.displayName = "DropdownContentDiv";

export class DropdownContent extends React.PureComponent<{
  children: React.ReactNode;
  onItemClick: (ev: React.MouseEvent<HTMLElement>) => void;
}> {
  static defaultProps = {
    // Completely silly standalone, because DropdownMenu injects the onItemClick handler
    onItemClick: () => {}
  };

  render() {
    return (
      <DropdownContentDiv>
        <ul role="listbox" aria-label="dropdown-content">
          {React.Children.map(this.props.children, child => {
            const childElement = child as React.ReactElement<any>;
            return React.cloneElement(childElement, {
              onClick: (ev: React.MouseEvent<HTMLElement>) => {
                childElement.props.onClick(ev);
                // Hide the menu
                this.props.onItemClick(ev);
              }
            });
          })}
        </ul>
      </DropdownContentDiv>
    );
  }
}
