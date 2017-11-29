/*
 * 本地存储
 * author:张渊
 * modifyTime:2017-5-16
 */
let Storage = {
    //获取指定名称localStorage的值
    get: function (name) {
        return localStorage.getItem(name);
    },
    //获取所有localStorage的值
    getAll: function () {
        var len = localStorage.length;
        if (len) {
            var results = {};
            for (var i = 0; i < len; i++) {
                var name = localStorage.key(i);
                results[name] = this.get(name);
            };
            return results;
        } else {
            return null;
        }
    },
    /*  
     * 设置localStorage
     *
     * @param array item localStorage键值对{name:"token", value:"ERTYU89OPLKJ"}
     *
     */
    set: function (item) {
        var len = item.length;
        for (var i = 0; i < len; i++) {
            var name = item[i].name;
            var value = item[i].value;
            localStorage.setItem(name, value);
        };
    },
    //删除指定名称的localStorage
    del: function (name) {
        localStorage.removeItem(name);
    },
    //清除所有localStorage
    clear: function () {
        localStorage.clear();
    }
};
export default Storage;