const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const CopyWebpackPlugin = require("copy-webpack-plugin");

const development = process.env.NODE_ENV === 'development';

module.exports = {
    entry: ["babel-polyfill", "./src/index.ts"],
    devtool: development ? 'inline-source-map' : 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true,
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
        }),
        new CopyWebpackPlugin([{
            from: 'src/timber',
            to: 'timber'
        }], {}),
    ],
    module: {
        rules: [{
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    devServer: {
        port: 8082,
        host: "192.168.1.101",
        hot: true,
        inline: true,
        open: true,
        openPage: "",
        historyApiFallback: true,
        proxy: {
            "/api": {
                target: `http://localhost:4000`,
            },
            cookieDomainRewrite: "",
        },
    },
};
