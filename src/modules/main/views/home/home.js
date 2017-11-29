import SYS_CONFIG from 'config';
import Http from 'utils/httpRequest.js';
import Pannel from 'components/base/pannel/install.js';
import {
    SelectAddress
} from 'components/base/selectAddress/install.js';
import Storage from 'utils/storage';
import Helper from 'utils/helper';
import RsaEncode from 'utils/rsaEncode';
import {
    Picker,
    OrderPicker,
    DateTimePicker
} from 'components/base/picker/install.js';
class Home {
    constructor(viewport) {
        let self = this;
        // this.picker = new DateTimePicker({
        //     confirm: {
        //         callback: function () {
        //             console.log(this.getSelectedValue());
        //         }
        //     }
        // });
        // this.picker.render();
        //this.loadData();
        this.init();
    }
    init() {
        this.selectAddress = new SelectAddress();
    }
    update() {}
    loadData() {
        //自动登录方法
        Http.autoLogin = function (callback) {
            let token = Storage.get("token");
            let deviceNo = Storage.get("deviceNo");
            token = "202A0238105648B9912278F5067E6D8F";
            deviceNo = "ff1bc0ddc93bf17052d39e7e4d094652";
            if (!token || token == "" || !deviceNo || deviceNo == "") {
                Helper.redirect(LOADING_URL);
                return;
            }
            RsaEncode([deviceNo], function (arr) {
                let url = SYS_CONFIG.AUTH_URL + "eco-user/tokenLogin.html";
                Http.base({
                    url: url,
                    type: "POST",
                    data: {
                        deviceNo: arr[0],
                        token: token
                    },
                    succeed: (res) => {
                        alert(res);
                        res.data && res.data.nextAutoLoginToken && Storage.set([{
                            name: "token",
                            value: res.data.nextAutoLoginToken
                        }]);
                        callback && callback();
                    },
                    failure: (res) => {
                        Helper.redirect(LOADING_URL);
                    }
                });
            });
        };
        Http.request({
            url: "http://xxx.jumaps.com:8000/vehicle/getByPage.html",
            type: "POST",
            headers: null,
            data: {
                pageNo: 1,
                pageSize: 10
            }
        });
        Http.request({
            url: "http://xxx.jumaps.com:8000/accident/getByPage.html",
            type: "POST",
            headers: null,
            data: {
                pageNo: 1,
                pageSize: 10
            }
        });
    }
    destroy() {
        console.log("destroy");
    }
}
export default Home;