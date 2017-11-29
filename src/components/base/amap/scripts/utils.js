//地图工具类
let MapUtils = {
    /**
     * 坐标转地址
     * 
     * @param {array} location 当前点坐标
     * @param {function} callback 回调函数
     * @returns 
     */
    getAddress(location, callback) {
        try {
            let geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getAddress(location, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                    let ret = result.regeocode;
                    let detail = {
                        name: ret.addressComponent.city,
                        location: location,
                        address: ret.formattedAddress
                    };
                    callback && callback(location, detail);
                }
            });
        } catch (err) {
            console.error(`AMap.Geocoder未定义，请注意是否已经加载该插件！\n详细信息：${err}`);
        }

    },
    /**
     * 地址转坐标
     * 
     * @param {string} address 地址
     * @param {function} callback 回调函数
     * @returns 
     */
    getLocation(address, callback) {
        try {
            let geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
            });
            geocoder.getLocation(address, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    let geocode = result.geocodes;
                    let locRet = [geocode[0].location.getLng(), geocode[0].location.getLat()];
                    callback && callback(locRet);
                }
            });
        } catch (err) {
            console.error(`AMap.Geocoder未定义，请注意是否已经加载该插件！\n详细信息：${err}`);
        }
    }
};
export default MapUtils;