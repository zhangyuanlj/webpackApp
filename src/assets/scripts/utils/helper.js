/*
 * 工具助手
 * author:张渊
 * modifyTime:2017-2-8
 */
let Helper = {
    //获取根地址
    getBaseUrl() {
        let baseUrl = location.protocol + `//${location.host}/`;
        return baseUrl;
    },
    /**
     * 跳转
     * @param string url 地址
     * @param object param 浏览器参数
     */
    location: function (url, param) {
        var locUrl = url;
        if (param) {
            var paramArr = [];
            for (var i in param) {
                paramArr.push(i + "=" + param[i]);
            }
            locUrl = url + "?" + paramArr.join("&");
        }
        location.href = locUrl;
    },
    //重定向
    redirect: function (url) {
        this.location(url);
    },
    /**
     * 取地址栏参数,如果不存在返回空字符串
     *
     * @param string paramName 参数名称
     * @param string url 地址字符串,如果不传入则为浏览器地址从问号 (?) 开始的 URL
     *
     */
    getUrlParam: function (paramName, url) {
        var _url = url ?
            url :
            window.location.search;
        var svalue = _url.match(new RegExp("[\?\&]" + paramName + "=([^\&]*)(\&?)", "i"));
        return svalue ?
            svalue[1] :
            "";
    },
    /**
     * 给地址设置时间戳，防止缓存
     *
     * @param string url 地址
     *
     */
    addTimeStamp: function (url) {
        var date = new Date();
        var connect = "?";
        if (url.indexOf("?") != -1) {
            connect = "&";
        }
        return url + connect + "timeStamp=" + date.getTime();
    },
    /**
     * 延迟执行一个函数
     *
     * @param function callback 回调函数
     * @param integer delayTime 延迟时间，毫秒为单位
     *
     */
    delayFunc: function (callback, delayTime) {
        return setTimeout(callback, delayTime);
    },
    /**
     * 生成产生min到max之间的随机数
     *
     * @param integer min 最小值
     * @param integer max 最大值
     *
     */
    getRandomNum: function (min, max) {
        var range = max - min;
        var rand = Math.random();
        return (min + Math.round(rand * range));
    },
    /*
     * 获取文件后缀名
     *
     * @param string fileName 文件名
     *
     */
    getFileSuffix: function (fileName) {
        var suffix = /\.[^\.]+$/.exec(fileName);
        return suffix;
    },
    /**
     * 设置组件id
     * @param string name 组件名称
     */
    setId: function (name) {
        var id = new Date()
            .getTime()
            .toString(36);
        id += Math
            .random()
            .toString(36)
            .substr(3);
        return name + "-" + id;
    },
    /**
     * 判断变量的值是否是 undefined
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的值是 undefined 时返回 true
     */
    isUndefined: function (o) {
        return typeof (o) === "undefined";
    },

    /**
     * 判断变量的值是否是 null
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的值是 null 时返回 true
     */
    isNull: function (o) {
        return o === null;
    },

    /**
     * 判断变量的类型是否是 Number
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 number 时返回 true
     */
    isNumber: function (o) {
        return (o === 0 || o) && o.constructor === Number;
    },

    /**
     * 判断变量的类型是否是 Boolean
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 boolean 时返回 true
     */
    isBoolean: function (o) {
        return (o === false || o) && (o.constructor === Boolean);
    },

    /**
     * 判断变量的类型是否是 String
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 string 时返回 true
     */
    isString: function (o) {
        return (o === "" || o) && (o.constructor === String);
    },

    /**
     * 判断变量的类型是否是 Object
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 object 时返回 true
     */
    isObject: function (o) {
        return o && (o.constructor === Object || Object.prototype.toString.call(o) === "[object Object]");
    },

    /**
     * 判断变量的类型是否是 Array
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 array 时返回 true
     */
    isArray: function (o) {
        return o && (o.constructor === Array || Object.prototype.toString.call(o) === "[object Array]");
    },

    /**
     * 判断变量的类型是否是 Function
     * @param {mixed} o 传入被检测变量的名称
     * @return {boolean} 当 o 的类型是 function 时返回 true
     */
    isFunction: function (o) {
        return o && (o.constructor === Function);
    },
    /**
     * 判断变量的类型
     * @param {mixed} o 传入被检测变量的名称
     * @return {string} 返回变量的类型，如果不知道则返回"other"
     */
    typeOf: function (o) {
        var type = "other";
        if (this.isUndefined(o)) {
            type = "undefined";
        } else if (this.isNull(o)) {
            type = "null";
        } else if (this.isNumber(o)) {
            type = "number";
        } else if (this.isBoolean(o)) {
            type = "boolean";
        } else if (this.isString(o)) {
            type = "string";
        } else if (this.isObject(o)) {
            type = "object";
        } else if (this.isArray(o)) {
            type = "array";
        } else if (this.isFunction(o)) {
            type = "function";
        }
        return type;
    },
    /**
     * 判断变量是否为数组的元素
     *
     * @param {integer} value 要检测的变量
     * @param {array} array 数组
     * @returns 如果存在返回该变量在数组中的索引,否则返回-1
     */
    inArray: function (value, array) {
        if (!this.isArray(array)) {
            console.error("第二个参数类型必须为数组!");
        }
        let len = array.length;
        for (i = 0; i < len; i++) {
            if (value == array[i]) {
                return i;
            }
        }
        return -1;
    },
    /**
     * 实现对象的深度拷贝
     *
     * @param {object} src 目标对象
     * @param {object} source 拷贝对象
     * @returns
     */
    deepCopy: function (src, source) {
        for (let key in source) {
            if (this.isObject(source[key])) {
                src[key] = src[key] ?
                    src[key] : {};
                this.deepCopy(src[key], source[key]);
            } else {
                src[key] = source[key];
            }
        }
        return src;
    },
    /**
     * 数字前面自动补零
     * 
     * @param {integer} num 数字 
     * @param {integer} n 补零后数字的位数
     * @returns 
     */
    prefixInteger: function (num, n) {
        return (Array(n).join(0) + num).slice(-n);
    }
};
export default Helper;