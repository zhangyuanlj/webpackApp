import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import ScriptsLoader from 'utils/loadScripts.js';
import '../styles/amap.style';
/**
 * 高德地图类
 * 
 * @class Map
 */
class Map {
    /**
     * Creates an instance of Map.
     * @param {string} container 显示容器ID
     * @memberof Map
     */
    constructor(container) {
        this.container = container;
        this.pluginsLoaded = false;
        this.defaults = {
            initConfig: {
                width: "100%",
                height: "100%",
                key: "88849e0bf91150659e86cb0bd0d05e35",
                plugins: [],
                mapLoadCallback: amap => {
                    return true;
                },
                loadPluginsCallback: amap => {
                    return true;
                }
            },
            AMapConfig: {
                resizeEnable: true,
                zoom: 11
            }
        };
        this.scriptsLoader = new ScriptsLoader();
    }
    init(options) {
        let protocol = location.protocol;
        this.amap = null;
        this.defaults = $.extend(true, this.defaults, options);
        this.initConfig = this.defaults.initConfig;
        this.AMapConfig = this.defaults.AMapConfig;
        let mapUrl =
            protocol +
            "//webapi.amap.com/maps?v=1.3&key=" +
            this.initConfig.key +
            "&callback=initMap";
        let initMap = () => {
            if (this.amap) {
                this.amap.destroy();
                this.amap = null;
            }
            this.amap = new AMap.Map(this.container, this.AMapConfig);
            this.initConfig.mapLoadCallback(this.amap);
            if (this.initConfig.plugins.length) {
                if (this.pluginsLoaded) {
                    this.initConfig.loadPluginsCallback(this.amap);
                } else {
                    AMap.plugin(this.initConfig.plugins, () => {
                        this.pluginsLoaded = true;
                        this.initConfig.loadPluginsCallback(this.amap);
                    });
                }
            }
        };
        this.setContainer();
        if (window.initMap) {
            initMap();
        } else {
            window.initMap = initMap;
            this.scriptsLoader.load([mapUrl]);
        }
    }
    setContainer() {
        let $container = $(`#${this.container}`);
        let self = this;
        $container.css({
            width: self.initConfig.width,
            height: self.initConfig.height
        });
    }
    /**
     * 按照行政区名称或adcode来设置地图显示的中心点
     * 
     * @param {string} city 行政区名称或adcode
     * @param {function} callback 回调函数，可选
     * @memberof Map
     */
    setCity(city, callback) {
        this.amap.setCity(city, callback);
    }
    /**
     * 设置地图显示的中心点
     * 
     * @param {array} position 经纬度，[lng,lat]
     * @memberof Map
     */
    setCenter(position) {
        this.amap.setCenter(position);
    }
    clear() {
        this.amap.clearMap();
    }
}
export default Map;