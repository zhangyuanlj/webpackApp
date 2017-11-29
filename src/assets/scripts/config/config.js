import BUILD_CONFIG from '../../../../build/config.js';
import DEVELOP_CONFIG from './developConfig.js';
import TEST_CONFIG from './testConfig.js';
import PRODUCT_CONFIG from './productConfig.js';
import ERROR_MSG_CONFIG from './errorMsgConfig.js';
const BASE_PATH = "/";
const USER_AGENT = window.navigator.userAgent; //浏览器信息头
const PROTOCOL = location.protocol;
const HOST = location.host;
const DOMAIN_NAME = PROTOCOL + "//" + HOST; //域名
const BASE_URL = DOMAIN_NAME + "/";
const ENTRY_URL = "main.html"; //入口地址
const LOGIN_URL = BASE_URL + ENTRY_URL + "#/login/";
const CONFIG = {
    develop: DEVELOP_CONFIG,
    test: TEST_CONFIG,
    product: PRODUCT_CONFIG
};
export default {
    IMAGE_PATH: '//juma-tgm.oss-cn-shenzhen.aliyuncs.com/',
    BASE_PATH: BASE_PATH,
    USER_AGENT: USER_AGENT,
    PROTOCOL: PROTOCOL,
    HOST: HOST,
    DOMAIN_NAME: DOMAIN_NAME,
    BASE_URL: BASE_URL,
    ENTRY_URL: ENTRY_URL,
    LOGIN_URL: LOGIN_URL,
    IS_WECHAT: BUILD_CONFIG.isWeChat,
    REQUEST_URL: CONFIG[BUILD_CONFIG.environment].REQUEST_URL,
    AUTH_URL: CONFIG[BUILD_CONFIG.environment].AUTH_URL,
    WALLET_URL: CONFIG[BUILD_CONFIG.environment].WALLET_URL,
    UID_STR: CONFIG[BUILD_CONFIG.environment].UID_STR,
    //业务异常码
    NOT_LOGIN_BUSINESS_ERRORKEY: ["notLogin", "sessionFail"], //没有登录
    TOKEN_EXPIRED: ["tokenError", "authorizationCodeError", "validationFailure"], //token过期
    //埋点配置
    COLLECT_JS_URL: CONFIG[BUILD_CONFIG.environment].COLLECT_JS_URL,
    COLLECT_PHP_URL: CONFIG[BUILD_CONFIG.environment].COLLECT_PHP_URL,
    //应用版本号
    APP_VERSION: BUILD_CONFIG.appVersion,
    ERROR_MSG: ERROR_MSG_CONFIG
};