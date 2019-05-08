/**
 * This script is used to create styled-components createGlobalStyle`` strings for use by components.
 */

import * as fs from "fs";
import * as path from "path";
import * as util from "util";

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdirp = util.promisify(require("mkdirp"));

async function loadCSS(filename: string): Promise<string> {
  const rawCSS = await readFile(filename);

  const cssInJS = `
  import { createGlobalStyle } from "styled-components"

  const css = createGlobalStyle\`${rawCSS}\`;
  export default css;
  `;

  return cssInJS;
}

type Manifest = Array<{
  cssIn: string;
  tsOut: string;
}>;

async function processManifest(manifest: Manifest) {
  for (const entry of manifest) {
    console.log(`Processing CSS of ${entry.cssIn}`);

    const result = await loadCSS(entry.cssIn);
    await mkdirp(path.dirname(entry.tsOut));
    await writeFile(entry.tsOut, result);
    console.log(`Wrote CSS for ${entry.cssIn} to ${entry.tsOut}`);
  }
}

const manifest = [
  {
    cssIn: require.resolve("@blueprintjs/core/lib/css/blueprint.css"),
    tsOut: path.join(__dirname, "..", "src/vendor/blueprint-css.ts")
  },
  {
    cssIn: require.resolve("@blueprintjs/select/lib/css/blueprint-select.css"),
    tsOut: path.join(__dirname, "..", "src/vendor/blueprint-select-css.ts")
  }
];

console.log("Converting CSS to CSS-in-JS");
processManifest(manifest)
  .then(() => {
    console.log("✨");
  })
  .catch(err => {
    console.error(err);
    process.exit(3);
  });
