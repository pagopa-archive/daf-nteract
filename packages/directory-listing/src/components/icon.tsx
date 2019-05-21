import { Book, FileDirectory, FileText } from "@nteract/octicons";
import * as React from "react";
import styled from "styled-components";

interface IconProps {
  color: string;
  fileType: "unknown" | "notebook" | "directory" | "file" | "dummy";
}

const IconWrapper = styled.span.attrs(props => ({
  style: { color: props.color }
}))`
  vertical-align: middle;
  text-align: center;
  opacity: 0.95;
`;

IconWrapper.displayName = "IconWrapper";

export class Icon extends React.PureComponent<IconProps> {
  static defaultProps: Partial<IconProps> = {
    color: "#0366d6",
    fileType: "file"
  };

  render() {
    let icon = <FileText />;
    switch (this.props.fileType) {
      case "notebook":
        icon = <Book />;
        break;
      case "directory":
        icon = <FileDirectory />;
        break;
      case "file":
        icon = <FileText />;
        break;
      default:
        icon = <FileText />;
    }

    return <IconWrapper color={this.props.color}>{icon}</IconWrapper>;
  }
}

export default Icon;
