/*
 * 路由操作
 * author:张渊
 * modifyTime:2017-06-02
 */
let Route = {
    set: function (baseUrl, moduleName, parameters) {
        var url = baseUrl;
        if (moduleName) {
            url += "#/" + moduleName + "/";
        }
        if (parameters) {
            var temp = [];
            for (var i in parameters) {
                if (parameters[i] == "") {
                    temp.push(i);
                } else {
                    temp.push(i + "=" + parameters[i]);
                }
            }
            temp = temp.join("&");
            url += "?" + temp;
        }
        return encodeURI(url);
    },
    /**
     * 向地址栏添加参数
     * @param object parameters 参数对象
     */
    add: function (parameters) {
        var url = location.href;
        var connector = "?";
        var temp = [];
        if (url.indexOf(connector) == -1) {
            url += connector;
        }
        for (var i in parameters) {
            if (parameters[i] == "") {
                temp.push(i);
            } else {
                temp.push(i + "=" + parameters[i]);
            }
        }
        temp = temp.join("&");
        url += temp;
        return url;
    },
    /**
     * 获取地址栏参数
     * @return string moduleName 模块名称
     * @return object parameters 参数对象
     */
    get: function () {
        var url = decodeURI(location.hash);
        var moduleNameReg = /\#\/.*(\/)/g;
        var paramReg = /(\?).*/g;
        var moduleName = url.match(moduleNameReg);
        var parameters = url.match(paramReg);
        if (moduleName) {
            moduleName = moduleName[0];
            moduleName = moduleName.substr(2, moduleName.length - 3);
        }
        if (parameters) {
            parameters = parameters[0];
            parameters = parameters.substr(1, parameters.length - 1);
            parameters = parameters.split("&");
            var len = parameters.length;
            var ret = {};
            for (var i = 0; i < len; i++) {
                //如果参数没有值则值为true
                if(parameters[i].indexOf("=") != -1){
                    var temp = parameters[i].split("=");
                    ret[temp[0]] = temp[1];
                }
                else{
                    ret[parameters[i]] = true;
                }
            }
            parameters = ret;
        }
        return {
            moduleName: moduleName,
            parameters: parameters
        };
    },
    //获取模块名称的快捷方法
    getModuleName: function () {
        var ret = this.get();
        return ret.moduleName;
    },
    //获取地址栏参数的快捷方法
    getParameters: function () {
        var ret = this.get();
        return ret.parameters;
    }
};
export default Route;