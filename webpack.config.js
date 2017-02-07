const webpack = require('webpack')
const path = require('path');

module.exports = {
  entry: ['./app/index.js', 'webpack-hot-middleware/client'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel', query: {presets: ['es2015', 'react'] } },
      { test: /\.scss$/, loaders: ['style', 'css', 'sass'] }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by Justin'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}