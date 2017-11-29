import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
/**
 * 创建marker
 * 
 * @class Marker
 */
class Marker {
    /**
     * Creates an instance of Marker.
     * @param {object} map 地图实例 
     * @param {array} data marker点数据，配置项参照http://lbs.amap.com/api/javascript-api/reference/overlay#Marker中的MarkerOptions;
       增加name属性，该属性值必须唯一，你可以使用name获取一个marker实例;
       增加callback属性，如果存在该属性，将他作为mousedown的回调函数;
     * @memberof Marker
     */
    constructor(map, data) {
        this.amap = map;
        this.data = data;
        this.markerList = {};
    }
    init() {
        try {
            const eventName = "touchstart";
            this.data.forEach(ret => {
                let name = ret.name;
                delete ret.name;
                this.markerList[name] = new AMap.Marker(ret);
                this.markerList[name].setMap(this.amap);
                if ($.type(ret.callback) == "function") {
                    this.markerList[name].off(eventName);
                    this.markerList[name].on(eventName, (e) => {
                        ret.callback(e, this.markerList[name]);
                    });
                }
            });
        } catch (err) {
            console.error(`请注意：创建marker失败，请检查data参数，该参数不能为空数组！\n详细信息：${err}`);
        }
    }
    /**
     * 根据name获取一个marker实例
     * 
     * @param {string} name marker的name 
     * @returns 
     * @memberof Marker
     */
    getMarker(name) {
        return this.markerList[name];
    }
    getMarkerList() {
        return this.markerList;
    }
    clear() {
        for (let marker in this.markerList) {
            marker.setMap(null);
        }
    }
}
export default Marker;