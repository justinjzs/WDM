const webpack = require('webpack')
const path = require('path');

module.exports = {
  entry: ['./app/index.js', 'webpack-hot-middleware/client', 'webpack/hot/dev-server'],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: { 
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
     } },
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