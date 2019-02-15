// Since this has to be loaded at the stage of use by webpack and won't be
// transpiled, all types use flow's "comment style".

// From https://github.com/ReactiveX/rxjs/blob/01a09789a0a9484c368b7bd6ed37f94d25490a00/doc/pipeable-operators.md#build-and-treeshaking
const rxAliases = require("rxjs/_esm5/path-mapping")();

const { aliases } = require("./aliases");

// We don't transpile packages in node_modules, unless it's _our_ package
// Also don't transpile @nteract/plotly because it's plotly and massive
// Explicitly ignore the typescript/lib in monaco, or everything fails
const exclude = /node_modules\/(?!(@nteract\/(?!plotly)|rx-jupyter|rx-binder|ansi-to-react|enchannel-zmq-backend|fs-observable))|vs\/language\/typescript\/lib/;

function mergeDefaultAliases(originalAlias /*: ?Aliases */) /*: Aliases */ {
  return {
    // Whatever came in before
    ...originalAlias,
    // Alias nteract packages
    ...aliases,
    // Alias RxJS modules
    ...rxAliases
  };
}

const tsLoaderConfig = {
  loader: "ts-loader",
  options: {
    transpileOnly: true,
    compilerOptions: {
      noEmit: false
    }
  }
};

// We will follow the next.js universal webpack configuration signature
// https://zeit.co/blog/next5#universal-webpack-and-next-plugins

function nextWebpack(config /*: WebpackConfig */) /*: WebpackConfig */ {
  config.externals = ["canvas", ...config.externals];
  config.module.rules = config.module.rules.map(rule => {
    if (
      rule.test.source.includes("js") &&
      typeof rule.exclude !== "undefined"
    ) {
      rule.exclude = exclude;
    }

    return rule;
  });

  config.module.rules.push({
    tsLoaderConfig
  });

  config.resolve = Object.assign({}, config.resolve, {
    mainFields: ["nteractDesktop", "jsnext:main", "module", "main"],
    alias: mergeDefaultAliases(
      config.resolve ? config.resolve.alias : undefined
    ),
    extensions: [".js", ".jsx", ".ts", ".tsx"]
  });
  return config;
}

module.exports = {
  exclude,
  aliases,
  mergeDefaultAliases,
  nextWebpack,
  tsLoaderConfig
};
