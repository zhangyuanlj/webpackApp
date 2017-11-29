/*
 * 操作cookie
 * author:张渊
 * modifyTime:2017-5-16
 */
let Cookie = {
    /*  
     * 遍历cookie列表
     *
     * @return string keys 每个cookie的键名
     *
     */
    _eachCookie: function () {
        let list = document.cookie;
        let keys = list.match(/[^ =;]+(?=\=)/g);
        return keys;
    },
    _getExpires: function (expires) {
        let str = expires.substr(0, 1);
        let time = parseInt(expires.substr(1, expires.length));
        if (str === "d") {
            return time * 24 * 3600 * 1000;
        } else if (str === "h") {
            return time * 3600 * 1000;
        } else if (str === "s") {
            return time * 1000;
        }
    },
    //获取指定名称cookie的值
    get: function (name) {
        let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) {
            return unescape(arr[2]);
        }
        return null;
    },
    //获取所有cookie的值
    getAll: function () {
        let keys = this._eachCookie();
        if (keys) {
            let results = {};
            for (let i = 0; i < keys.length; i++) {
                results[keys[i]] = this.get(keys[i]);
            }
            return results;
        } else {
            return null;
        }
    },
    /*  
     * 设置cookie
     *
     * @param array item cookie键值对{name:"token", value:"ERTYU89OPLKJ", expires:"h50"}
     * 说明：expires属性的值s50:表示50秒，h50:表示50小时，d50:表示50天
     *
     */
    set: function (item) {
        let len = item.length;
        for (let i = 0; i < len; i++) {
            let name = item[i].name;
            let value = item[i].value;
            let ret = "";
            if (item[i].expires) {
                let expires = this._getExpires(item[i].expires);
                let date = new Date();
                date.setTime(date.getTime() + expires);
                ret = ";expires=" + date.toGMTString();
            }            
            if (!item[i].domain) {
                ret = name + "=" + value + ";path=/" + ret;
            } else {
                ret = name + "=" + value + ";domain=" + item[i].domain + ";path=/" + ret;
            }  
            document.cookie = ret;
        }
    },
    //删除指定名称的cookie
    del: function (name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.get(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
        }
    },
    //清除所有cookie
    clear: function () {
        let keys = this._eachCookie();
        if (keys) {
            for (let i = 0; i < keys.length; i++) {
                this.del(keys[i]);
            }
        }
    }
};
export default Cookie;