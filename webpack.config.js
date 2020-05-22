const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  entry: path.join(__dirname, '_javascripts', 'entry'),
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'assets'),
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, 'bower_components'),
        ],
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      }
    ],
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx'],
  },
};