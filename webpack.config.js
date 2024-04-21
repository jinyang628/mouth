const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');


module.exports = {
  mode: 'development',
  entry: './src/main.js', // Adjust this according to your entry file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true, // This enables watching files for changes and recompiling
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // Add other loaders here
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' // Adjust if your HTML file is located elsewhere
    })
  ]
};
