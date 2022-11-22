const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration[]} */
module.exports = [{
    mode: 'development',
    entry: './test_page/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: './dist',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    optimization: {
        runtimeChunk: 'single',
    },
}, {
    name: 'build',
    mode: 'production',
    entry: path.resolve(__dirname, "./dist/esm/index.js"),
    output: {
        path: path.resolve(__dirname, "./dist/umd"),
        filename: "index.js",
        library: "myLibrary",
        libraryTarget: "umd",
        globalObject: "this"
    },
}];
