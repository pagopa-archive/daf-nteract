/**
 * Reads the jupyter config data that the python side of this
 * jupyter extension writes out to the html page.
 */

import * as React from "react";
import ReactDOM from "react-dom";

export interface JupyterConfigData {
  token: string;
  page: "tree" | "view" | "edit";
  contentsPath: string;
  baseUrl: string;
  appVersion: string;
  assetUrl: string;
}

const ErrorPage = (props: { error?: Error }) => (
  <React.Fragment>
    <h1>ERROR</h1>
    <pre>Unable to parse / process the jupyter config data.</pre>
    {props.error ? props.error.message : null}
  </React.Fragment>
);

export function readConfig(
  rootEl: Element,
  dataEl: Element
): JupyterConfigData {
  if (!dataEl) {
    ReactDOM.render(<ErrorPage />, rootEl);
    throw new Error("No jupyter config data element");
  }

  let config: JupyterConfigData;

  try {
    if (!dataEl.textContent) {
      throw new Error("Unable to find Jupyter config data.");
    }
    config = JSON.parse(dataEl.textContent);
  } catch (err) {
    ReactDOM.render(<ErrorPage error={err} />, rootEl);
    // Re-throw error
    throw err;
  }

  return config;
}
