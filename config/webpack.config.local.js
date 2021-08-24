const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const dartSass = require('dart-sass');
const autoPreFixer = require('autoprefixer');
const common = require('./webpack-settings/webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, `../${process.env.FOLDER_PUBLIC_BASE}`),
    compress: true,
    port: 9003,
    open: true,
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
            options: {minimize: false},
          },
          {
            loader: 'postcss-loader',
            options: {
              minimize: false,
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
              minimize: false,
              sourceMap: true,
              sourceMapContents: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new LiveReloadPlugin(),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: `./${process.env.FOLDER_PRIVATE_BASE}/index.twig`,
      inject: true,
    }),
  ],
});
