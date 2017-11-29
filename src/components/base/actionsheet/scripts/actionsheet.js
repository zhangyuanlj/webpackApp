import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import IScrollModule from 'libs/iscroll.min.js';
import PopLayer from 'components/base/poplayer.js';
import Template from 'utils/template.js';
import 'utils/templateHelper.js';
import tpl from '../tpl/actionsheet.tpl';
import '../styles/actionsheet.style';
const aniSpeed = 500;
class ActionSheet extends Component {
    constructor(options) {
        super();
        this.defaults = {
            dataConfig: {
                title: {
                    show: false,
                    name: "",
                    describe: ""
                },
                itemList: []
            },
            cancel: {
                show: true,
                name: "取消",
                callback: () => {
                    return true;
                }
            },
            isPop: false,
            modal: {
                el: ".c-modal",
                clickHide: true
            },
            showCallback: () => {
                return true;
            }
        };
        this.layerAni = 6;
        this.position = 4;
        this.el = ActionSheet.getEl();
        this.setOptions(options);
        this.create();
    }
    static getEl() {
        return {
            $win: $(window),
            $html: $("html"),
            $body: $("body")
        };
    }
    static getWidgetName() {
        return "actionsheet";
    }
    create() {
        let self = this;
        let defaults = this.defaults;
        let id = this.setId(ActionSheet.getWidgetName());
        defaults["id"] = id;
        let render = Template.compile(tpl);
        html = render(defaults);
        this.remove();
        this.el.$body.append(html);
        this.$widget = $(`#${id}`);
        this.bindItemEvent();
        if (defaults.isPop) {
            let showCallback = this.defaults.showCallback;
            this.layerAni = 10;
            this.position = 7;
            defaults.cancel.show = false;
            this.$widget.show();
            this.setPopConscroll();
            this.defaults.showCallback = () => {
                showCallback();
            };
        } else {
            if (defaults.cancel.show) {
                this.bindCancelEvent();
            }
        }
        this.popLayer = new PopLayer({
            $layer: self.$widget,
            layerAni: self.layerAni,
            aniSpeed: aniSpeed,
            modal: self.defaults.modal,
            position: self.position,
            showCallback: self.defaults.showCallback,
            marginValue: 0,
            hideCallback: () => {
                this.remove();
            }
        });
        this.popLayer.layerShow();
    }
    getPopMaxHeight() {
        return this.el.$win.height() / 2;
    }
    setPopConscroll() {
        let max = this.getPopMaxHeight();
        let conH = this.$widget.height();
        if (conH > max) {
            this.$widget.height(max);
            if (this.conScroll) {
                this.conScroll.destroy();
            }
            this.conScroll = new IScrollModule.iScroll(this.$widget[0], {
                hScroll: false,
                vScrollbar: false,
                onBeforeScrollStart: null
            });
        }
    }
    remove() {
        let $actionsheet = $(".c-actionsheet");
        if ($actionsheet.length) {
            $actionsheet.parent(this.defaults.modal.el).remove();
        }
    }
    //给具有callback属性的item绑定事件
    bindItemEvent() {
        let self = this;
        this.$widget.find(".item").off().on("mousedown", function () {
            let $this = $(this);
            let index = $this.index();
            let callback = self.defaults.dataConfig.itemList[index].callback;
            if ($.type(callback) == "function") {
                callback.call(self, $this);
            }
        });
    }
    //绑定取消按钮事件
    bindCancelEvent() {
        let self = this;
        this.$widget.find(".cancel-btn").off().on("mousedown", function () {
            self.popLayer.layerHide();
        });
    }
}
export default ActionSheet;