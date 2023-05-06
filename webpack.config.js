const path = require('path');
const Dotenv = require("dotenv-webpack");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {

  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader'
      }
    ]
  },
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'var',
    library: 'Worker'
  },
  plugins: [
    new Dotenv(),
    new NodePolyfillPlugin()
  ],
}