const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      // Do not generate .map files in development
      config.devtool('none');
    }
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  }
})