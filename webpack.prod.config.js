const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const buildConfig = require('./build/config');
var len = webpackBaseConfig.template.length;
var ENV = process.env.NODE_ENV;
var IS_DEBUG = ("pro" === ENV) ? false : true;
var plugins = [
    new webpack.DefinePlugin({
        _ENV_DEBUG_: IS_DEBUG
    }),
    new ExtractTextPlugin({
        filename: buildConfig.stylesPath + '/common.[hash].css',
        allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ["common", "vendors"]
    }),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
        }
    }),
    new CleanWebpackPlugin([buildConfig.buildPath], {
        root: __dirname,
        verbose: true,
        dry: false
    })
];
for (var i = 0; i < len; i++) {
    plugins.push(new HtmlWebpackPlugin(webpackBaseConfig.template[i]));
}
module.exports = merge(webpackBaseConfig.webpack, {
    output: {
        filename: buildConfig.scriptsPath + '/[name].[hash].js',
        chunkFilename: buildConfig.scriptsPath + '/[name].[hash].chunk.js'
    },
    plugins: plugins
});