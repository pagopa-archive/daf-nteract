const configurator = require("@nteract/webpack-configurator");
const withTypescript = require("@zeit/next-typescript");

module.exports = withTypescript({ webpack: configurator.nextWebpack });
