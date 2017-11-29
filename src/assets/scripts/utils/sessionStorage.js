/*
 * 本地sessionStorage存储
 * author: 曹建宇
 * modifyTime:2017-10-18
 */
let Storage = {
    //获取指定名称sessionStorage的值
    get: function (name) {
        return sessionStorage.getItem(name);
    },
    //获取所有sessionStorage的值
    getAll: function () {
        var len = sessionStorage.length;
        if (len) {
            var results = {};
            for (var i = 0; i < len; i++) {
                var name = sessionStorage.key(i);
                results[name] = this.get(name);
            };
            return results;
        } else {
            return null;
        }
    },
    /*  
     * 设置sessionStorage
     *
     * @param array item sessionStorage键值对{name:"token", value:"ERTYU89OPLKJ"}
     *
     */
    set: function (item) {
        var len = item.length;
        for (var i = 0; i < len; i++) {
            var name = item[i].name;
            var value = item[i].value;
            sessionStorage.setItem(name, value);
        };
    },
    //删除指定名称的sessionStorage
    del: function (name) {
        sessionStorage.removeItem(name);
    },
    //清除所有sessionStorage
    clear: function () {
        sessionStorage.clear();
    }
};
export default Storage;