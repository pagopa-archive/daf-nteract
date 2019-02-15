// @flow
const { lernaModules } = require("./monorepo");

// Write out all the monorepo packages that are not libraries -- typically applications or metapackages
const ignored = new Set([
  // we don't reuse the desktop app as a library
  "nteract",

  // It's this package, the one you're currently looking at! We must skip it.
  "@nteract/webpack-configurator",

  // The jupyter extension will rely on this package
  "nteract-on-jupyter",
  // The nbextension is the metapackage (python bits) and isn't used by anything
  "@nteract/nbextension"
]);

const aliases = lernaModules
  // filter out the ignored modules
  .filter(pkg => !ignored.has(pkg.name))
  .reduce((all, pkg) => {
    // Set each alias as pointing in to the `src` directory
    // e.g. @nteract/markdown -> @nteract/markdown/src
    //
    // This enables us to be able to transpile from direct source in the webpack
    // run
    all[pkg.name] = `${pkg.name}/src`;
    return all;
  }, {});

module.exports = {
  aliases
};
