import SYS_CONFIG from 'config';
import LOGIN_CONFIG from './config.js';
import Http from 'utils/httpRequest.js';
import {
    Map,
    LinePlan
} from 'components/base/amap/install.js';
import Actionsheet from 'components/base/actionsheet/install.js';
import './styles/login.style';
class Login {
    constructor(viewport) {
        this.viewport = viewport;
        this.header = this.viewport.getHeader();
        this.nav = this.viewport.getNav();
        this.$contentView = this.viewport.getContentView();
        this.init();
        this.loadData();
    }
    init() {
        this.$contentView.html('<div id="wybill-map" class="m-wybill-map"></div>');
        this.initMap();
        this.header.update(LOGIN_CONFIG.HEADER);
    }
    update() {}
    initMap() {
        this.amap = new Map("wybill-map");
        this.amap.init({
            initConfig: {
                plugins: ["AMap.Driving"],
                loadPluginsCallback: amap => {
                    let markerOptions = [{
                            name: "start",
                            position: [104.063675, 30.57703],
                            callback: (e, marker) => {
                                alert(1);
                                console.log(marker);
                            }
                        },
                        {
                            name: "delivery1",
                            position: [104.065992, 30.657838]
                        },
                        {
                            name: "delivery2",
                            position: [104.066164, 30.633839]
                        },
                        {
                            name: "delivery3",
                            position: [104.121525, 30.709729]
                        },
                        {
                            name: "end",
                            position: [104.112384, 30.749146]
                        }
                    ];
                    let pathOptions = {
                        startPoints: [104.063675, 30.57703],
                        endPoints: [104.112384, 30.749146],
                        mid: [
                            [104.065992, 30.657838],
                            [104.066164, 30.633839],
                            [104.121525, 30.709729]
                        ]
                    };
                    this.linePlan = new LinePlan(amap);
                    this.linePlan.init({
                        markerOptions: markerOptions,
                        pathOptions: pathOptions
                    });
                }
            }
        });
    }
    loadData() {
        console.log(Http.requestList);
    }
    destroy() {
        console.log("destroy");
    }
}
export default Login;