import * as React from "react";
import TimeAgo, { Formatter, Suffix, Unit } from "react-timeago";
import styled from "styled-components";
import { TimeAgoTD } from "../../../../packages/pdnd-nteract-packages/theme";

interface LastSavedProps {
  lastModified?: Date | null;
}

// const TimeAgoTD = styled.span`
//   color: #6a737d;
// `;

// Rather than showing a continual counter like "0 seconds ago"
// followed by "1 seconds ago", and so on, just show "less than a minute"
const slowDownFormatter: Formatter = (
  value: number,
  unit: Unit,
  suffix: Suffix,
  epochMiliseconds: number,
  nextFormatter?: Formatter
) => {
  if (unit === "second") {
    return "less than a minute";
  }

  // This should be defined but we'll play it safe given the type definition
  if (!nextFormatter) {
    return `${value} ${unit} ${suffix}`;
  }

  return nextFormatter(value, unit, suffix, epochMiliseconds);
};

TimeAgoTD.displayName = "TimeAgoTD";

export class LastSaved extends React.PureComponent<LastSavedProps> {
  static defaultProps = {
    lastModified: null
  };

  render() {
    return (
      <TimeAgoTD>
        {this.props.lastModified != null && (
          <TimeAgo
            date={this.props.lastModified}
            formatter={slowDownFormatter}
          />
        )}
      </TimeAgoTD>
    );
  }
}

export default LastSaved;
