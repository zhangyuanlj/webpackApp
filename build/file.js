const fs = require('fs');
const path = require('path');
/**
 * 创建所有目录
 *
 * @param {string} dirPath 目录路径
 * @param {integer} mode 目录权限
 * @param {function} callback 回调函数
 */
const mkdirs = function (dirPath, mode, callback) {
    fs.exists(dirPath, function (exists) {
            if (exists) {
                callback(dirPath);
            } else {
                //尝试创建父目录，然后再创建当前目录
                mkdirs(path.dirname(dirPath), mode, function () {
                    fs.mkdir(dirPath, mode, callback);
                });
            }
        });
};
/**
 * 递归删除目录
 *
 * @param {string} path 目录路径
 */
const deleteFolder = function (path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
module.exports = {
    mkdirs: mkdirs,
    deleteFolder: deleteFolder
};