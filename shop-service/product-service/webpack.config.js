const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  externals: [nodeExternals()],
  devtool: "nosources-source-map",
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx", ".json"],
    modules: ["node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
};
