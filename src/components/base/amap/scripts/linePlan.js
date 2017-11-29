import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Marker from './marker.js';
import Path from './path.js';
/**
 * 路径规划，使用前，请加载AMap.Driving插件
 * 
 * @class LinePlan
 */
class LinePlan {
    constructor(map) {
        this.amap = map;
        this.defaults = {
            markerOptions: [],
            pathOptions: {
                startPoints: [],
                endPoints: [],
                mid: []
            }
        };
    }
    init(options) {
        try {
            let self = this;
            let driving = new AMap.Driving({
                map: self.amap
            });
            this.defaults = $.extend(true, this.defaults, options);
            let startPoints = this.defaults.pathOptions.startPoints;
            let endPoints = this.defaults.pathOptions.endPoints;
            let mid = this.defaults.pathOptions.mid;
            this.marker = new Marker(this.amap, this.defaults.markerOptions);
            this.marker.init();
            if (!mid.length) {
                driving.search(new AMap.LngLat(startPoints[0], startPoints[1]), new AMap.LngLat(endPoints[0], endPoints[1]));
            } else {
                driving.search(new AMap.LngLat(startPoints[0], startPoints[1]), new AMap.LngLat(endPoints[0], endPoints[1]), {
                    waypoints: mid
                });
            }
        } catch (err) {
            console.error(`请注意：路径规划失败，请检查配置项startPoints、endPoints、mid参数类型，值是否正确！\n详细信息：${err}`);
        }
    }
}
export default LinePlan;