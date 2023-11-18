const { merge } = require('webpack-merge');
const baseConfig = require('./base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    open: true,
    proxy: {
      '/full-path': 'http://localhost:3000',
      '/prefix': 'http://localhost:3000',
      '/express-router': 'http://localhost:3000',
    },
  },
});
