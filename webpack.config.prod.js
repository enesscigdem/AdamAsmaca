const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html'
    }),
    new CopyPlugin({
      patterns: [
        { from: 'style.css', to: '.' }, // style.css dosyasını public köküne kopyala
        { from: 'favicon.ico', to: '.' } // Favicon'u da aynı şekilde kopyalayın
      ]
    })
  ]
};
