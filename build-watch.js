// build-watch.js

const webpack = require('webpack');
const config = require('@vue/cli-service/webpack.config.js');

const compiler = webpack(config);

compiler.watch({
  // Watch Options:
  aggregateTimeout: 300,
  poll: undefined
}, (err, stats) => { // [Stats Object](https://webpack.js.org/configuration/stats/)
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }

  console.log(stats.toString({
    chunks: false,  // Makes the build much quieter
    colors: true    // Shows colors in the console
  }));
});
