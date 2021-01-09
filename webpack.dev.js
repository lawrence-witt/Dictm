const HtmlWebPackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html"
});

const lintPlugin = new ESLintPlugin({
    files: 'src/**/*',
    extensions: ['ts', 'tsx']
});

const config = {
    mode: "development",
    entry: "./src/index.tsx",
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            }
        ]
    },
    devServer: {
        port: 3000
    },
    devtool: 'inline-source-map',
    plugins: [htmlPlugin, lintPlugin]
}

module.exports = config;