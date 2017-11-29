//项目配置文件，测试环境
const REQUEST_URL = "http://cal.jumaps.com/";
//用户中心域名
const AUTH_URL = REQUEST_URL + 'auth/';
//钱包域名
const WALLET_URL = REQUEST_URL + '';
//注册推送ID
const UID_STR = "PROD_JMAPP";
//埋点配置
const COLLECT_JS_URL = "//jmtj.jumaps.com/piwik/piwik.js";
const COLLECT_PHP_URL = "//jmtj.jumaps.com/piwik/piwik.php";
const CONFIG = {
    REQUEST_URL: REQUEST_URL,
    AUTH_URL: AUTH_URL,
    WALLET_URL: WALLET_URL,
    UID_STR: UID_STR,
    COLLECT_JS_URL: COLLECT_JS_URL,
    COLLECT_PHP_URL: COLLECT_PHP_URL
};
export default CONFIG;