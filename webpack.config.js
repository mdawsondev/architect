var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: "./src/app.js",
  output: {
    path: __dirname + "/dist",
    filename: "app.js"
  },
  target: 'node'
};