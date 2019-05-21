/**
 * Main entry point for the web notebook UI
 */

import { JupyterConfigData, readConfig } from "./config";

import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";

import "codemirror/lib/codemirror.css";
import "codemirror/addon/hint/show-hint.css";

import "react-table/react-table.css";

// Until we're switched to blueprint for the menu, we have our own custom css
// for the rc-menu style menu
import "./notebook-menu.css";

import "@nteract/styles/app.css";
import "@nteract/styles/global-variables.css";

import "@nteract/styles/editor-overrides.css";

import urljoin from "url-join";

const rootEl = document.querySelector("#root");
const dataEl = document.querySelector("#jupyter-config-data");

if (!rootEl || !dataEl) {
  alert("Something drastic happened, and we don't have config data");
} else {
  const config: JupyterConfigData = readConfig(rootEl, dataEl);

  const webpackPublicPath = urljoin(config.assetUrl, "nteract/static/dist/");
  // Allow chunks from webpack to load from their built location
  // NOTE: This _must_ run synchronously before webpack tries to load other
  // chunks, and must be a free variable
  // @ts-ignore
  __webpack_public_path__ = webpackPublicPath;

  import("./bootstrap").then(module => {
    module.main(config, rootEl);
  });
}
