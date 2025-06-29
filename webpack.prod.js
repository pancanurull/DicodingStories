const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Ganti GenerateSW dengan InjectManifest
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['@babel/preset-env'] }
        }],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    // Ganti konfigurasi GenerateSW dengan InjectManifest
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src/scripts/sw.js'), // Path ke file service worker kustom Anda
      swDest: 'sw.js', // Nama file service worker yang akan dihasilkan di folder dist
    }),
  ],
});