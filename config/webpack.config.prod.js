const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dartSass = require('dart-sass');
const autoPreFixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack-settings/webpack.common.js');
const tinyPngWebpackPlugin = require('tinypng-webpack-plugin');

// PRODUCTION конфигурация
module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              minimize: true,
              plugins: [autoPreFixer],
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {},
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: dartSass,
              minimize: true,
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: `./${process.env.FOLDER_PRIVATE_BASE}/index.twig`,
      inject: true,
    }),
    new tinyPngWebpackPlugin({
      key: process.env.KEY_TINY
    })
  ],
});
