//自动创建模块、组件模版
const config = require('./config');
const fs = require('fs');
const consoler = require('consoler');
var args = process
    .argv
    .splice(2);
var copyPath = args[0];
if (!fs.existsSync("./src/" + copyPath)) {
    consoler.error("错误：路径" + "./src/" + copyPath + "对应的目录不存在", ['red']);
} else {
    if (copyPath.lastIndexOf("/") == copyPath.length - 1) {
        consoler.error("错误：请不要在路径结尾处包含/", ['red']);
    } else {
        var foldName = args[1];
        var isModules = copyPath.indexOf("modules") != -1;
        var distPath = isModules ?
            "modules" :
            "components";
        templatePath = "./src/template/" + distPath;
        distPath = "./src/" + copyPath;
        var distDir = distPath + "/" + foldName;
        const copy = function (src, dst) {
            fs.writeFileSync(dst, fs.readFileSync(src));
        };
        //创建目录
        const createDir = function (path) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
        }
        //修改文件名
        const rename = function (oldPath, newPath) {
            fs.rename(oldPath, newPath);
        };
        //修改入口文件文件名
        const renameEntry = function () {
            var fileType = ".js";
            var entryPath = distDir + "/template" + fileType;
            var newPath = distDir + "/" + foldName + fileType;
            rename(entryPath, newPath);
        };
        //获取模版内容
        const getTemplate = function (path) {
            if (fs.existsSync(path)) {
                var files = fs.readdirSync(path);
                if (files.length) {
                    files
                        .forEach(function (file, index) {
                            if (file.indexOf("svn") != -1) {
                                return true;
                            }
                            var src = path + "/" + file;
                            var dst = "./src/" + copyPath + "/" + foldName + "/" + file;
                            var stat = fs.lstatSync(src);
                            if (stat.isDirectory()) {
                                createDir(dst);
                                getTemplate(path + "/" + file);
                            } else {
                                copy(src, dst);
                            }
                        });
                }
            }
        };
        consoler.loading('正在拷贝模版文件,请稍后...');
        createDir(distDir);
        getTemplate(templatePath);
        if (isModules) {
            renameEntry();
        }
        consoler.success('模板拷贝成功!');
    }
}