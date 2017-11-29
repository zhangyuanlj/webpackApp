const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const buildConfig = require('./build/config');
const getModulesList = require('./build/getModulesList');
var prod = process.argv.join("").indexOf("prod") != -1 ? true : false;
var modulesList = getModulesList(prod);
var template = modulesList.template;
module.exports = {
    template: template,
    webpack: {
        entry: modulesList.entry,
        output: {
            path: path.join(__dirname, './' + buildConfig.buildPath + "/" + buildConfig.assetsPath),
            publicPath: buildConfig.staticDomain + "/" + buildConfig.assetsPath + "/"
        },
        module: {
            loaders: [{
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            less: ExtractTextPlugin.extract({
                                use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                                fallback: 'vue-style-loader'
                            }),
                            css: ExtractTextPlugin.extract({
                                use: ['css-loader?minimize', 'autoprefixer-loader'],
                                fallback: 'vue-style-loader'
                            })
                        }
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader?minimize', 'autoprefixer-loader'],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.style$/,
                    loader: 'style-loader?minimize!css-loader?minimize!autoprefixer-loader!less-loader'
                },
                {
                    test: /\.less$/,
                    use: ExtractTextPlugin.extract({
                        use: ['css-loader?minimize', 'less-loader', 'autoprefixer-loader'],
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.(gif|jpg|jpeg|png|svg)\??.*$/,
                    loader: 'url-loader?limit=700&name=images/[hash].[ext]'
                },
                {
                    test: /\.(woff|svg|eot|ttf)\??.*$/,
                    loader: 'url-loader?limit=700&name=fonts/[hash].[ext]'
                },
                {
                    test: /\.(html|tpl)$/,
                    loader: 'html-loader?minimize'
                }
            ]
        },
        resolve: {
            alias: {
                src: path.resolve(__dirname, 'src'),
                assets: path.resolve(__dirname, 'src/assets'),
                libs: path.resolve(__dirname, 'src/assets/scripts/libs'),
                utils: path.resolve(__dirname, 'src/assets/scripts/utils'),
                components: path.resolve(__dirname, 'src/components'),
                modules: path.resolve(__dirname, 'src/modules'),
                jQuery: path.resolve(__dirname, 'src/assets/scripts/libs/zepto/zepto.min.js'),
                config: path.resolve(__dirname, 'src/assets/scripts/config/config.js')
            }
        }
    }
};