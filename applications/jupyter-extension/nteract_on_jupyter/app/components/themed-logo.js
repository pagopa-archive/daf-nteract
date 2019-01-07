/* @flow strict */
import * as React from "react";
import { WideLogo } from "@nteract/logos";
import { DAFWideLogo } from "../../../../../packages/daf-packages/daf-logo/daf-wide"

type ThemedLogoProps = {
  height: number,
  theme: "light" | "dark" | "daf"
};

const ThemedLogo = (props: ThemedLogoProps) => props.theme === "daf"
  ? <DAFWideLogo {...props} />
  : <WideLogo {...props} />

ThemedLogo.defaultProps = {
  height: 20,
  theme: "daf"
};

export { ThemedLogo };
