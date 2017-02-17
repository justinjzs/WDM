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
        test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: {
          presets: ['es2015', 'react'],
          "env": {
            // only enable it when process.env.NODE_ENV is 'development' or undefined
            "development": {
              "plugins": [["react-transform", {
                "transforms": [{
                  "transform": "react-transform-hmr",
                  // if you use React Native, pass "react-native" instead:
                  "imports": ["react"],
                  // this is important for Webpack HMR:
                  "locals": ["module"]
                }]
                // note: you can put more transforms into array
                // this is just one of them!
              }]]
            }
          }
        }
      },
      { test: /\.css$/, loaders: ['style', 'css'] }
    ]
  },
  resolve: {
    alias: {
      jquery: path.join(__dirname, 'Frontend/asset/js/jquery-3.1.1.min.js'),
      bootstrap: path.join(__dirname, 'Frontend/asset/js/bootstrap.min.js')
    }
  },
  plugins: [
    new webpack.BannerPlugin('This file is created by Justin'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ]
}