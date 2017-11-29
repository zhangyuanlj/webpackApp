import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import PopLayer from 'components/base/poplayer.js';
import '../styles/pannel.style';
import tpl from '../tpl/pannel.tpl';
const LAYER_ANI = 6;
const POSITION = 4;
const ANI_SPEED = 500;
/**
 * 弹出面板
 * 
 * @class Pannel
 * @extends {Component}
 */
class Pannel extends Component {
    constructor(options) {
        super();
        this.defaults = {
            titleConfig: {
                show: true,
                text: "弹出面板",
                cancel: {
                    show: false,
                    text: "取消",
                    callback: () => {
                        return true;
                    }
                },
                confirm: {
                    show: false,
                    text: "确定",
                    callback: () => {
                        return true;
                    }
                }
            },
            modal: {
                el: ".c-modal"
            },
            showBtn: true,
            height: "auto",
            showCallback: function () {
                return true;
            },
            confirmCallback: function () {
                return true;
            }
        };
        this.$el = Pannel.getEl();
        this.setOptions(options);
        this.baseFontSize = parseFloat(this.$el.$html.css("font-size"));
        this.create();
    }
    static getWidgetName() {
        return "pannel";
    }
    static getEl() {
        return {
            $html: $("html"),
            $body: $("body")
        };
    }
    create() {
        let self = this;
        let id = this.setId(Pannel.getWidgetName());
        let tmp = tpl.replace(/{id}/g, id);
        let titleConfig = this.defaults.titleConfig;
        let height = this.defaults.height;
        tmp = tmp.replace(/{title}/g, this.defaults.titleConfig.text);
        this.remove();
        this.$el.$body.append(tmp);
        this.$widget = $("#" + id);
        if (titleConfig.show) {
            let $cancelBtn = this.$widget.find(".title-box .cancel");
            let $confirmBtn = this.$widget.find(".title-box .confirm");
            if (titleConfig.cancel.show) {
                $cancelBtn.show().text(titleConfig.cancel.text);
                this.registerEvent("cancel");
            } else {
                $cancelBtn.hide();
            }
            if (titleConfig.confirm.show) {
                $confirmBtn.show().text(titleConfig.confirm.text);
                this.registerEvent("confirm");
            } else {
                $confirmBtn.hide();
            }
        } else {
            this.$widget.find(".title-box").hide();
        }
        if (height !== "auto") {
            this.$widget.find(".scroll-area").css("height", height / this.baseFontSize + "rem");
        }
        this.popLayer = new PopLayer({
            $layer: self.$widget,
            layerAni: LAYER_ANI,
            aniSpeed: ANI_SPEED,
            modal: {
                el: self.defaults.modal.el,
                show: true,
                clickHide: true
            },
            position: POSITION,
            marginValue: 0,
            showCallback: self.defaults.showCallback,
            hideCallback: () => {
                this.remove();
            }
        });
        this.popLayer.layerShow();
    }
    remove() {
        let $pannel = $(".c-pannel");
        if ($pannel.length) {
            $pannel.parent(this.defaults.modal.el).remove();
        }
    }
    /**
     * 获取滚动视图
     * 
     * @returns 滚动视图
     * 
     * @memberof Pannel 
     */
    getScrollView() {
        return this.$widget.find(".scroll-area");
    }
    registerEvent(btnName) {
        let self = this;
        let titleConfig = this.defaults.titleConfig;
        //取消
        this.$widget.find("." + btnName).off().on("mousedown", function () {
            let callback = titleConfig[btnName].callback;
            self.popLayer.layerHide();
            callback && callback.call(self, $(this));
        });
    }
}
export default Pannel;