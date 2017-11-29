import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
const AUTH_URL = SYS_CONFIG.AUTH_URL;
const APP_ID = SYS_CONFIG.APP_ID;
const AUTH_OFFICIAL_KEY = SYS_CONFIG.AUTH_OFFICIAL_KEY;
/**
 * 微信JS-SDK调用接口
 */
let Jwx = {
    // 是否已初始化
    inited: false,
    // 初始化
    init: function () {
        let wxModules = ['getLocation', 'openLocation'];
        !this.inited && this.getSignature(wxModules);
    },
    //获取签名
    getSignature: function (wxModules) {
        let location = window.location;
        let localUrl = location.href.split('#')[0];
        $.ajax({
            url: AUTH_URL + 'wechatOfficial/createJSSDKSignature-' + AUTH_OFFICIAL_KEY + '.html',
            data: {
                accessUrl: localUrl
            },
            dataType: "jsonp",
            success: function (res) {
                let result = eval(res);
                let data = result.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: APP_ID, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.noncestr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: ['getLocation', 'openLocation'] // wxModules // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                this.inited = true;
            }
        });
    },
    // 显示地图
    openLocation: function (options) {
        let defaults = {
            point: [], //坐标[纬度，经度]
            name: "", // 位置名
            address: "", // 地址详情说明
            scale: 8, // 地图缩放级别,整形值,范围从1~28。默认为最大
            infoUrl: "" // 在查看位置界面底部显示的超链接,可点击跳转
        };
        $.extend(defaults, options);
        wx.ready(function () {
            wx.openLocation({
                latitude: parseFloat(defaults.point[1]), // 纬度，浮点数，范围为90 ~ -90
                longitude: parseFloat(defaults.point[0]), // 经度，浮点数，范围为180 ~ -180。
                name: defaults.name,
                address: defaults.address,
                scale: defaults.scale,
                infoUrl: defaults.infoUrl
            });
        });
    },
    // 获取位置坐标
    getLocation: function (callback) {
        let defaultPosition = [104.065842, 30.657708]; //默认坐标 天府广场
        wx.ready(function () {
            wx.getLocation({
                type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function (res) {
                    let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    let point = [longitude, latitude];
                    callback && typeof (callback) == "function" && callback(point);
                },
                cancel: function (res) {
                    callback && typeof (callback) == "function" && callback(defaultPosition);
                },
                fail: function (res) {
                    callback && typeof (callback) == "function" && callback(defaultPosition);
                }
            });
        });
    }
};
export default Jwx;