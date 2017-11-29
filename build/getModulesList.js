const config = require('./config');
const consoler = require('consoler');
const fs = require('fs');
//获取入口脚本和入口页面
var getModulesList = function (prod) {
    try {
        var entry = {
            vendors: "./src/vendors.js",
            common: "./src/common.js"
        };
        var template = [];
        var path = "./src/modules";
        if (fs.existsSync(path)) {
            var files = fs.readdirSync(path);
            if (files.length) {
                files.forEach(function (file, index) {
                    if (file.indexOf("svn") != -1) {
                        return true;
                    }
                    var stat = fs.lstatSync(path + "/" + file);
                    if (stat.isDirectory()) {
                        entry[file] = path + "/" + file + "/" + file;
                        var templateOptions = {
                            name: file,
                            title: config.projectTitle,
                            designWidth: config.designWidth,
                            designFontSize: config.designFontSize,
                            isWeChat: config.isWeChat,
                            filename: "../" + file + ".html",
                            template: "./src/template/template.ejs",
                            inject: false,
                            chunks: ["vendors", "common", file],
                        };
                        if (prod) {
                            if (config.staticDomain != "") {
                                templateOptions["staticDomain"] = config.staticDomain;
                            }
                            templateOptions["minify"] = {
                                removeEmptyAttributes: true,
                                removeComments: true,
                                collapseWhitespace: true,
                                minifyCSS: true,
                                minifyJS: true
                            };
                        }
                        template.push(templateOptions);
                    }
                });
            }
        }
        return {
            entry: entry,
            template: template
        };
    } catch (err) {
        consoler.error(err);
    }
};
module.exports = getModulesList;