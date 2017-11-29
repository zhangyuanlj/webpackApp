const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const buildConfig = require('./build/config');
var len = webpackBaseConfig.template.length;
var plugins = [
    new ExtractTextPlugin({
        filename: buildConfig.stylesPath + '/common.css',
        allChunks: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ["common", "vendors"]
    })
];
for (var i = 0; i < len; i++) {
    plugins.push(new HtmlWebpackPlugin(webpackBaseConfig.template[i]));
}
module.exports = merge(webpackBaseConfig.webpack, {
    devtool: '#source-map',
    output: {
        filename: buildConfig.scriptsPath + '/[name].js',
        chunkFilename: buildConfig.scriptsPath + '/[name].chunk.js'
    },
    devServer: {
        disableHostCheck: true
    },
    plugins: plugins
});