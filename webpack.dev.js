const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./template.html"
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
    plugins: [htmlPlugin]
}

module.exports = config;