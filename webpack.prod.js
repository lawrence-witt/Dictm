const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const copyPlugin = new CopyWebpackPlugin({
    patterns: [
        { from: 'public' }
    ]
})

const config = {
    mode: "production",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
            {
                test: /\.css?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'css/[hash].[ext]'
                        }
                    },
                    'style-loader', 
                    'css-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    outputPath: 'css/',
                    publicPath: url => '../css/' + url
                }
            }
        ]
    },
    devtool: 'source-map',
    plugins: [htmlPlugin, copyPlugin]
}

module.exports = config;