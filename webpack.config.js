const WebpackNotifierPlugin = require('webpack-notifier');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'inferno': 'inferno/dist/index.dev.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader',
        options: {
          ident: 'postcss',
          postcssOptions: {
            plugins: () => [
              require('postcss-short')(),
            ]
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules\/(?!(dmn-js|dmn-js-drd|dmn-js-shared|dmn-js-decision-table|table-js|dmn-js-literal-expression|diagram-js)\/).*/,
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env']
        }
      }
    ]
  },
  plugins: [
    new WebpackNotifierPlugin({
      alwaysNotify: true,
      title: 'App Name',
      contentImage: path.join(__dirname, 'image.png')
    })
  ]
};
