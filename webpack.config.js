const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: {
        popup: "./app/src/pages/index.tsx",
        options: "./app/src/pages/options.tsx",
        background: './app/src/background.ts',
        contentScript: './app/src/contentScript.ts'
    },
    devtool: 'inline-source-map',
    mode: "development",
    module: {
        rules: [
            {
              test: /\.tsx?$/,
               use: [
                 {
                  loader: "ts-loader",
                   options: {
                     compilerOptions: { noEmit: false },
                    }
                  }],
               exclude: /node_modules/,
            },
            {
              exclude: /node_modules/,
              test: /\.css$/i,
               use: [
                  "style-loader",
                  "css-loader"
               ]
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "icons", to: "icons" },
                { from: "manifest.json", to: "manifest.json" },
            ],
        }),
        new HTMLPlugin({
            template: "app/public/popup.html", 
            filename: "popup.html", 
            chunks: ["popup"], 
        }),
        new HTMLPlugin({
            template: "app/public/options.html",
            filename: "options.html",
            chunks: ["options"],
        }),
        new CopyPlugin({
            patterns: [
                { from: "config.json", to: "config.json"}
            ]
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "js/[name].js",
    },
    optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      },
      
};

function getHtmlPlugins(chunks) {
    return chunks.map(
        (chunk) =>
            new HTMLPlugin({
                title: "React extension",
                filename: `${chunk}.html`,
                chunks: [chunk],
            })
    );
}