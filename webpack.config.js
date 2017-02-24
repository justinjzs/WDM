const webpack = require('webpack')
const path = require('path');

module.exports = {
  entry: {
    home: ['./Frontend/app/index.js', 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
    share: './Frontend/share'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' 
      },
      { test: /\.css$/, loaders: ['style', 'css'] }
    ]
  },
  resolve: {
    alias: {
      bootstrap: path.join(__dirname, 'Frontend/asset/js/bootstrap.min.js')
    }
  },
  externals: {
    jquery: 'jQuery'
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by Justin'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}