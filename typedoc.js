module.exports = {
  name: "nteract",
  mode: "modules",
  out: "nteract-packages/public",
  theme: "default",
  ignoreCompilerErrors: "true",
  preserveConstEnums: "false",
  exclude: [
    "*.spec.ts",
    "*.test.ts",
    "**/node_modules/**",
    "**/__tests__/**",
    "**/packages/vega-embed2/**",
    "*.js"
  ],
  externalPattern: "**/node_modules/**",
  excludeExternals: "true",
  stripInternal: "false",
  tsconfig: "tsconfig.base.json",
  target: "es6",
  module: "commonjs",
  "external-modulemap": ".*/packages/([\\w\\-_]+)/",
  readme: "packages/README.md"
};
