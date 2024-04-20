const { defineConfig } = require('@vue/cli-service')
module.exports = {
  filenameHashing: false,
  chainWebpack: config => {
    config.optimization.delete('splitChunks');
  },
  configureWebpack: {
    output: {
      filename: '[name].js'
    }
  }
};
