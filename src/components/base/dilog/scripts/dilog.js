import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import PopLayer from 'components/base/poplayer.js';
import '../styles/dilog.style';
import tpl from '../tpl/dilog.tpl';
const LAYER_ANI = 6;
const POSITION = 7;
const ANI_SPEED = 500;
/**
 * 对话框组件
 * 
 * @class Dilog
 * @extends {Component}
 */
class Dilog extends Component {
    constructor(options) {
        super();
        this.defaults = {
            title: {
                show: true,
                content: "<h4>确认要退出吗?</h4>"
            },
            content: "",
            modal: {
                el: ".c-modal",
                show: true,
                clickHide: true
            },
            btn: [{
                name: "取消",
                callback: function () {}
            }, {
                name: "确定",
                callback: function () {}
            }],
            showCallback: function () {
                return true;
            }
        };
        this.el = Dilog.getEl();
        this.setOptions(options);
        this.defaults.btn = options.btn;
        this.create();
    }
    static getEl() {
        return {
            $html: $("html"),
            $body: $("body")
        };
    }
    static getWidgetName() {
        return "dilog";
    }
    create() {
        let self = this;
        let id = this.setId(Dilog.getWidgetName());
        let tplHtml = tpl.replace(/{id}/g, id);
        let titleConfig = this.defaults.title;
        if (titleConfig.show) {
            tplHtml = tplHtml.replace(/{hide}/g, "");
            tplHtml = tplHtml.replace(/{title}/g, titleConfig.content);
        } else {
            tplHtml = tplHtml.replace(/{hide}/g, ' style="display:none;"');
            tplHtml = tplHtml.replace(/{title}/g, "");
        }
        tplHtml = tplHtml.replace(/{content}/g, this.defaults.content);
        tplHtml = tplHtml.replace(/{btn}/g, this.renderBtn());
        this.remove();
        this.el.$body.append(tplHtml);
        this.$widget = $("#" + id);
        let $btn = this.$widget.find(".c-dilog-btn");
        if (this.defaults.btn.length == 1) {
            $btn.addClass("c-dilog-btn-single");
        } else {
            $btn.removeClass("c-dilog-btn-single");
        }
        this.popLayer = new PopLayer({
            $layer: self.$widget,
            layerAni: LAYER_ANI,
            aniSpeed: ANI_SPEED,
            modal: self.defaults.modal,
            position: POSITION,
            showCallback: self.defaults.showCallback,
            hideCallback: () => {
                this.remove();
            }
        });
        this.popLayer.layerShow();
        this.registerEvent();
    }
    renderBtn() {
        let btnConfig = this.defaults.btn;
        let btnTmp = [];
        btnConfig.forEach((value, index, btnList) => {
            let styleName = "cancel";
            if (index == 1 || btnList.length == 1) {
                styleName = "confirm";
            }
            btnTmp.push('<a href="javascript:void(0);" class=' + styleName + ' data-btn-index="' + index + '">' + value.name + '</a>');
        });
        return btnTmp.join("\n");
    }
    remove() {
        let $dilog = $(".c-dilog");
        if ($dilog.length) {
            $dilog.parent(this.defaults.modal.el).remove();
        }
    }
    registerEvent() {
        let self = this;
        let btnCallback = function ($btn) {
            let btnIndex = $btn.attr("data-btn-index");
            if ($btn.hasClass("cancel")) {
                self.popLayer.layerHide();
            }
            self.defaults.btn[btnIndex].callback.call(self);
        };
        this.$widget.find("a").off().on("mousedown", function (e) {
            btnCallback($(this));
            e.stopPropagation();
        });
    }
}
export default Dilog;