import * as React from "react";
import styled from "styled-components";

interface ListingProps {
  children: React.ReactNode;
}

const ListingRoot = styled.table`
  margin: 0px 0px 20px 0px;
  width: 100%;
  border-collapse: collapse;
  border-radius: 2px;
  border-spacing: 0;
  table-layout: auto;
`;

ListingRoot.displayName = "ListingRoot";

export class Listing extends React.PureComponent<ListingProps> {
  static defaultProps = {
    children: null
  };

  render() {
    return (
      <ListingRoot>
        <tbody>{this.props.children}</tbody>
      </ListingRoot>
    );
  }
}

export default Listing;
