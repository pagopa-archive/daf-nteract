import * as React from "react";
import TimeAgo from "react-timeago";
import styled from "styled-components";
import { TimeAgoTD } from "../../../../packages/pdnd-nteract-packages/theme";

interface LastSavedProps {
  lastModified?: Date | null;
}

// const TimeAgoTD = styled.td`
//   text-align: right;
//   color: #6a737d;
//   padding-right: 10px;
// `;

TimeAgoTD.displayName = "TimeAgoTD";

export class LastSaved extends React.PureComponent<LastSavedProps> {
  static defaultProps = {
    lastModified: null
  };

  render() {
    return (
      <TimeAgoTD>
        {this.props.lastModified != null && (
          <TimeAgo date={this.props.lastModified} />
        )}
      </TimeAgoTD>
    );
  }
}
