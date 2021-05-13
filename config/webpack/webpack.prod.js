const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Paths

const outputPath = path.resolve(__dirname, "../../build");
const tsConfigPath = path.resolve(__dirname, "../typescript/tsconfig.prod.json");

// Plugins

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html"
});

const copyPlugin = new CopyWebpackPlugin({
    patterns: [
        { from: 'public' }
    ]
});

const analyserPlugin = new BundleAnalyzerPlugin();

// Config

const config = {
    mode: "production",
    entry: {
        main: "./src/index.tsx"
    },
    output: {
        path: outputPath,
        filename: "[name].[contenthash].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    configFile: tsConfigPath
                }
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
    plugins: [htmlPlugin, copyPlugin, analyserPlugin]
}

module.exports = config;