const HtmlWebPackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html"
});

const lintPlugin = new ESLintPlugin({
    files: './src/**/*',
    extensions: ['.ts', '.tsx']
});

const copyPlugin = new CopyWebpackPlugin({
    patterns: [
        { from: 'public' }
    ]
})

const config = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        publicPath: '/'
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css?$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|ttf|otf)$/,
                loader: 'file-loader'
            }
        ]
    },
    devServer: {
        port: 3000,
        host: "0.0.0.0",
        historyApiFallback: true
    },
    devtool: 'inline-source-map',
    plugins: [htmlPlugin, lintPlugin, copyPlugin]
}

module.exports = config;