import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import PopLayer from 'components/base/poplayer.js';
import '../styles/toast.style';
import tpl from '../tpl/toast.tpl';
const SHOW_TIME = 1000;
const ANI_SPEED = 500;
/**
 * toast提示
 * 
 * @class Toast
 * @extends {Component}
 */
class Toast extends Component {
    constructor(options) {
        super();
        this.defaults = {
            //位置 top,center,botttom
            pos: "center",
            content: "及时提醒组件",
            modal: {
                el: ".c-modal"
            },
            autoHide: {
                enable: true,
                delayTime: SHOW_TIME
            },
            hideCallback: function () {
                return true;
            }
        };
        this.el = Toast.getEl();
        this.setOptions(options);
        this.create();
    }
    static getEl() {
        return {
            $body: $("body")
        };
    }
    static getWidgetName() {
        return "toast";
    }
    create() {
        let self = this;
        let id = this.setId(Toast.getWidgetName());
        let tplHtml = tpl.replace(/{id}/g, id);
        let position = 3;
        let layerAni = 8;
        let autoHide = this.defaults.autoHide;
        tplHtml = tplHtml.replace(/{content}/g, this.defaults.content);
        if (this.defaults.pos == "center") {
            position = 7;
        } else if (this.defaults.pos == "bottom") {
            position = 4;
            layerAni = 6;
        }
        this.remove();
        this.el.$body.append(tplHtml);
        this.$widget = $("#" + id);
        if (autoHide.enable) {
            let callback = this.defaults.hideCallback;
            this.defaults.hideCallback = () => {
                this.remove();
                callback();
            };
        }
        this.popLayer = new PopLayer({
            $layer: self.$widget,
            layerAni: layerAni,
            aniSpeed: ANI_SPEED,
            modal: {
                el: self.defaults.modal.el,
                show: true,
                clickHide: false
            },
            autoHide: autoHide,
            position: position,
            hideCallback: () => {
                this.defaults.hideCallback();
            }
        });
        this.show();
    }
    show() {
        this.popLayer.layerShow();
    }
    hide() {
        this.popLayer.layerHide();
    }
    remove() {
        if (this.$widget !== null) {
            this.$widget.parent(this.defaults.modal.el).remove();
        }
    }
}
export default Toast;