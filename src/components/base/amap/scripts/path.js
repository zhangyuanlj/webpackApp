import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
/**
 * 创建折线
 * 
 * @class Path
 */
class Path {
    /**
     * Creates an instance of Path.
     * @param {object} map 地图实例 
     * @memberof Path
     */
    constructor(map) {
        this.amap = map;
        this.defaults = {
            path: [],
            strokeColor: "#00bd00",
            strokeOpacity: 1,
            strokeWeight: 5,
            strokeStyle: "solid",
            strokeDasharray: [10, 5]
        };
    }
    init(options) {
        try {
            this.defaults = $.extend(true, this.defaults, options);
            let path = this.defaults.path;
            this.path = new AMap.Polyline(this.defaults);
            this.path.setMap(this.amap);
        } catch (err) {
            console.error(`请注意：创建折线失败，请检查path配置，该配置不能为空数组！\n详细信息：${err}`);
        }
    }
    getPath() {
        return this.path;
    }
    clear() {
        this.path.setMap(null);
    }
}
export default Path;