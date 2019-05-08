import * as React from "react";
import styled from "styled-components";

import { areComponentsEqual } from "react-hot-loader";

import { Icon } from "./icon";
interface EntryProps {
  children: React.ReactNode;
}

const DirectoryEntry = styled.tr`
  border-top: 1px solid #eaecef;

  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #f6f8fa;
    transition: background-color 0.1s ease-out;
  }

  & td {
    padding-top: 8px;
    padding-bottom: 8px;
    vertical-align: middle;
    width: auto;
    padding-left: 8px;
  }

  & td:last-child {
    text-align: right;
    padding-right: 10px;
  }
`;

DirectoryEntry.displayName = "DirectoryEntry";

export class Entry extends React.PureComponent<EntryProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <DirectoryEntry>
        {/* Wrap each child in a `<td>` */}
        {React.Children.map(this.props.children, child => {
          if (child && areComponentsEqual((child as any).type, Icon)) {
            return <td style={{ width: "25px" }}>{child}</td>;
          }
          return <td>{child}</td>;
        })}
      </DirectoryEntry>
    );
  }
}

export default Entry;
