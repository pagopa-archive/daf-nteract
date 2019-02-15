import { Book, FileDirectory, FileText } from "@nteract/octicons";
import * as React from "react";
import styled from "styled-components";

interface IconProps {
  color: string;
  fileType: "unknown" | "notebook" | "directory" | "file" | "dummy";
}

const IconTD = styled.td.attrs(props => ({
  style: {
    color: props.color
  }
}))`
  padding-right: 2px;
  padding-left: 10px;
  width: 17px;
  vertical-align: middle;
  text-align: center;
  opacity: 0.95;
  color: "#0366d6";
`;

IconTD.displayName = "IconTD";
IconTD.defaultProps = {
  color: "#0366d6"
};

export class Icon extends React.PureComponent<IconProps> {
  static defaultProps: Partial<IconProps> = {
    color: "#0366d6",
    fileType: "file"
  };

  render() {
    const styles = { color: this.props.color };
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

    return <IconTD>{icon}</IconTD>;
  }
}
