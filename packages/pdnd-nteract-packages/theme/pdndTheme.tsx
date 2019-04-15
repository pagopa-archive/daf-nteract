import React, { FunctionComponent, Fragment } from "react";
import styled, { StyledComponent } from "styled-components";
import { H4 as BlueprintH4, H3, Classes, Divider } from "@blueprintjs/core";

import { PdndWideLogo } from "./components/pdndLogos";

const WrapperDiv: StyledComponent<"div", any, {}, never> = styled.div`
  background-color: hsl(210, 100%, 40%);
  box-sizing: border-box;
`;

const H4: FunctionComponent = props => (
  <BlueprintH4
    {...props}
    className={Classes.DARK}
    style={{ marginBottom: 0 }}
  />
);

const TimeAgoTD: StyledComponent<"td", any, {}, never> = styled.td`
  color: #f5f8fa;
`;

const ThemedLogo = ({
  wrapperStyle = {
    display: "inline-flex",
    borderRight: "1px solid rgba(245, 248, 250, 0.5)"
  },
  headingStyle = {
    marginLeft: "10px",
    marginBottom: 0,
    marginRight: "20px"
  }
}) => (
  <div style={wrapperStyle}>
    <PdndWideLogo />
    <H3 className={Classes.DARK} style={headingStyle}>
      PDND Explorer
    </H3>
  </div>
);

export { WrapperDiv, ThemedLogo, H4, TimeAgoTD };
