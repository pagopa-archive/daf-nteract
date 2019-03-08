import React from "react";
import styled, { StyledComponent } from "styled-components";
import { H4 as BlueprintH4, Classes } from "@blueprintjs/core";

import { DafWideLogo as ThemedLogo } from "./components/dafLogos";

const WrapperDiv: StyledComponent<"div", any, {}, never> = styled.div`
  background-color: hsl(210, 100%, 40%);
  box-sizing: border-box;
`;

const H4 = (props: any): JSX.Element => (
  <BlueprintH4 className={Classes.DARK} {...props} />
);

const TimeAgoTD: StyledComponent<"td", any, {}, never> = styled.td`
  text-align: right;
  color: #f5f8fa;
  padding-right: 10px;
`;

export { WrapperDiv, ThemedLogo, H4, TimeAgoTD };
