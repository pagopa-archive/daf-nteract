import React, { FunctionComponent } from "react";
import styled, { StyledComponent } from "styled-components";
import { H4 as BlueprintH4, Classes } from "@blueprintjs/core";

import { PdndWideLogo as ThemedLogo } from "./components/pdndLogos";

const WrapperDiv: StyledComponent<"div", any, {}, never> = styled.div`
  background-color: hsl(210, 100%, 40%);
  box-sizing: border-box;
`;

const H4: FunctionComponent = props => (
  <BlueprintH4 className={Classes.DARK} {...props} />
);

const TimeAgoTD: StyledComponent<"td", any, {}, never> = styled.td`
  color: #f5f8fa;
`;

export { WrapperDiv, ThemedLogo, H4, TimeAgoTD };
