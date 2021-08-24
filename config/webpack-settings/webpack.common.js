const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const twigOption = require('./webpack.twig.option');
const ESLintPlugin = require('eslint-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');

const setProcessEnv = require('../env');

const generateHTMLPlugins = () => glob.sync(`./${process.env.FOLDER_PRIVATE_BASE}/pages/**/*.twig`).map(
  dir => new HtmlWebpackPlugin({
    filename: path.join('../', path.basename(dir).replace('.twig', '.html')), // Output
    template: dir, // Input
    inject: true,
  }),
);
// Добавление ENV переменных в конфигурацию
setProcessEnv(path.join(__dirname, `../../.env.${process.env.NODE_ENV}`));
module.exports = {
  entry: {
    main: [
      path.join(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}/index.js`),
      path.join(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}/index.scss`),
    ],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}`),
    },
  },
  output: {
    path: path.join(__dirname, `../../${process.env.FOLDER_PUBLIC_BASE}/css`),
    filename: '../js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}`),
        exclude: /(node_modules|bower_components)/,
        use: [
          'cache-loader',
          'babel-loader',
        ],

      },
      {
        test: /\.twig$/,
        use: [
          'raw-loader',
          {
            loader: 'twig-html-loader',
            options: twigOption,
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: 'file-loader',
        options: {
          context: path.resolve(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}`),
          outputPath: `../img/`,
        }
      },
      {
        test: /\.(woff2|woff|eot|ttf)$/i,
        loaders: 'file-loader',
        options: {
          context: path.resolve(__dirname, `../../${process.env.FOLDER_PRIVATE_BASE}`),
          outputPath: `../fonts/`,
        }
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new WebpackNotifierPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: false,
    }),
    new ESLintPlugin({
      cache: true,
      quiet: false,
    }),
    new ErrorOverlayPlugin(),
    ...generateHTMLPlugins(),
  ],
};
