/*
 * 异步请求方法
 * author:张渊
 * modifyTime:2017-11-21
 */
import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Helper from 'utils/helper.js';
import 'utils/json2.js';
import Toast from 'components/base/toast/install.js';
const LOGIN_INVALID = "登录过期,请重新登录";
const LOGIN_FAIL = "无法自动登录，请退出应用重试！";
const NETWORK_ANOMALY = "网络异常,请退出应用重试";
// 静默授权页地址，当前地址可能存在hash值，在微信静默授权时会报错，所以采用两次encodeURIComponent
const LOGIN_URL = SYS_CONFIG.IS_WECHAT ? SYS_CONFIG.LOGIN_URL + '?from=' + encodeURIComponent(encodeURIComponent(location.href)) : SYS_CONFIG.LOGIN_URL;
let HttpRequest = {
    //自动登录状态
    autoLoginStatus: "free",
    //自动登录队列
    autoLoginRequestList: null,
    //自动登录方法
    autoLogin(succeedCbs) {
        succeedCbs && typeof (succeedCbs) == "function" && succeedCbs();
    },
    /**
     * 创建toast提醒
     * 
     * @param {string} content 显示内容
     * @param {function} hideCallback 回调函数
     */
    createToast(content, hideCallback) {
        let config = {
            content: content
        };
        if (hideCallback && typeof (hideCallback) == "function") {
            config.hideCallback = hideCallback;
        }
        $(".c-toast").parent(".c-modal").remove();
        let toast = new Toast(config);
    },
    /**
     * 获取错误消息
     * 
     * @param {object} res 接口返回数据
     * @param {object} errorMsgConfig 本地错误信息配置
     * @returns 
     */
    getErrorMsg(res, errorMsgConfig) {
        let errorMsg = res.message;
        let businessErrorKey = res.businessErrorKey;
        if (businessErrorKey && errorMsgConfig[businessErrorKey]) {
            errorMsg = errorMsgConfig[businessErrorKey];
        }
        return errorMsg;
    },
    /**
     * 异常处理
     * 
     * @static
     * @param {object||string} res 后台返回的数据
     * @options {string} url 请求地址，用来删除队列中对应的请求
     * @options {function} succeed 成功时的回调函数
     * @options {function} failure 失败时的回调函数
     * @options {boolean} autoLogin 是否开启自动登录
     * @options {string} errorHandMode 错误处理模式，只显示错误消息:showErrorMsg、只执行错误方法:execErrorFunc、显示错误消息并执行错误方法:all
     * @memberof HttpRequest
     */
    abnormal(res, options) {
        //code为非0时,表示该次请求出现异常
        let code = parseInt(res.code);
        let defaults = {
            url: "",
            succeed: (res) => {
                return true;
            },
            failure: (res) => {
                return true;
            },
            autoLogin: false,
            errorHandMode: "all"
        };
        const redirectLogin = () => {
            this.createToast(LOGIN_INVALID, () => {
                Helper.redirect(LOGIN_URL);
            });
        };
        $.extend(true, defaults, options);
        //当res类型为字符串时,数据为后端渲染好的模板
        if ($.type(res) == "string" || !code) {
            if (this.autoLoginStatus == "complete") {
                let key = defaults.url;
                if (this.autoLoginRequestList !== null && this.autoLoginRequestList[key]) {
                    delete this.autoLoginRequestList[key];
                }
            }
            defaults.succeed(res);
        } else {
            //没有登录
            if ($.inArray(res.businessErrorKey, SYS_CONFIG.NOT_LOGIN_BUSINESS_ERRORKEY) != -1) {
                //自动登录
                if (defaults.autoLogin) {
                    //当自动登录状态为free时，才发起自动登录
                    if (this.autoLoginStatus == "free") {
                        this.autoLoginStatus = "loading";
                        this.autoLogin(() => {
                            this.autoLoginStatus = "complete";
                            for (let key in this.autoLoginRequestList) {
                                this.request(this.autoLoginRequestList[key]);
                            }
                        });
                    }
                    //如果自动登录状态为已完成，则表示出现异常
                    else if (this.autoLoginStatus == "complete") {
                        this.createToast(LOGIN_FAIL);
                    }
                }
            }
            //token失效
            else if ($.inArray(res.businessErrorKey, SYS_CONFIG.TOKEN_EXPIRED) != -1) {
                redirectLogin();
            } else {
                let errorMsg = this.getErrorMsg(res, SYS_CONFIG.ERROR_MSG);
                let errorHandMode = defaults.errorHandMode;
                if (errorHandMode == "all") {
                    this.createToast(errorMsg, function () {
                        defaults.failure(res);
                    });
                } else if (errorHandMode == "showErrorMsg") {
                    this.createToast(errorMsg);
                } else if (errorHandMode == "execErrorFunc") {
                    defaults.failure(res);
                }
            }
        }
    },
    /**
     * 创建一个请求
     * 
     * @static
     * @options {string} url 请求地址
     * @options {string} type 请求方式
     * @options {object} data 请求数据
     * @options {string} dataType 发送jsonp请求
     * @options {boolean} cache 是否开启缓存
     * @options {boolean} autoLogin 是否开启自动登录
     * @options {object} headers 请求头
     * @options {string} errorHandMode 错误处理模式
     * @options {function} succeed 成功回调
     * @options {function} failure 失败回调
     * @options {function} error 错误回调
     * @returns {object} xhr 请求对象
     * @memberof HttpRequest
     */
    base(options) {
        let ajax = null;
        let defaults = {
            url: "",
            type: "GET",
            data: null,
            dataType: "",
            headers: {
                "Content-Type": "application/json"
            },
            cache: false,
            autoLogin: false,
            errorHandMode: "all",
            succeed: function (res) {
                return true;
            },
            failure: function (res) {
                return true;
            },
            error: function () {
                return true;
            }
        };
        $.extend(true, defaults, options);
        let url = defaults.url;
        let type = defaults.type;
        let data = defaults.data;
        if (type == "GET") {
            defaults.headers = null;
        }
        if (data !== null && defaults.headers !== null) {
            data = JSON.stringify(data);
        }
        let ajaxConfig = {
            type: type,
            url: url,
            data: data,
            headers: defaults.headers,
            success: (res, status, xhr) => {
                let abnormalConfig = {
                    url: url,
                    succeed: defaults.succeed,
                    failure: defaults.failure,
                    errorHandMode: defaults.errorHandMode,
                    autoLogin: defaults.autoLogin
                };
                this.abnormal(res, abnormalConfig);
            },
            error: (xhr, errorType, error) => {
                if (errorType != "success" && errorType != "abort") {
                    let toast = new Toast({
                        content: NETWORK_ANOMALY
                    });
                    defaults.error();
                }
            }
        };
        if (defaults.dataType == "jsonp") {
            ajaxConfig["type"] = "GET";
            ajaxConfig["dataType"] = "jsonp";
        }
        ajax = $.ajax(ajaxConfig);
        if (defaults.autoLogin) {
            if (this.autoLoginRequestList === null) {
                this.autoLoginRequestList = {};
            }
            this.autoLoginRequestList[url] = defaults;
        }
        return ajax;
    },
    //创建包含自动登录功能的请求，options和base方法的options保持一致
    request(options) {
        let _options = options;
        _options["autoLogin"] = true;
        this.base(_options);
    },
    //重置
    reset() {
        this.autoLoginStatus = "free";
        this.autoLoginRequestList = null;
    }
};
export default HttpRequest;