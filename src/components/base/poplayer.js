/*
 * 弹出层
 * author:张渊
 * modifyTime:2017-04-16
 */
import Zepto from 'jQuery';
import Component from 'components/base/component.js';
class PopLayer extends Component {
    constructor(options) {
        super();
        this.defaults = {
            $layer: $("#layerId"),
            closeBtn: ".close-dilog",
            //弹出层显示动画,对应_privateStatic中ani定义的动画类型
            layerAni: 5,
            aniSpeed: 500,
            autoHide: {
                enable: false,
                delayTime: 5000
            },
            modal: {
                el: ".c-modal",
                show: true,
                //点击蒙层,弹出层隐藏与否
                clickHide: true
            },
            position: 7,
            marginValue: 10,
            showCallback: function () {
                return true;
            },
            beforeHideCallback: function () {
                return true;
            },
            hideCallback: function () {
                return true;
            },
            registerEvent: {}
        };
        this.setOptions(options);
        this.$widget = this.defaults.$layer;
        this.$widget.css("animation-duration", this.defaults.aniSpeed + "ms");
        this.$mask = this.defaults.modal.show ? this.$widget.parent(this.defaults.modal.el) : null;
        this.delayTime = null;
        this.aniIn = PopLayer.ani.in;
        this.aniOut = PopLayer.ani.out;
        this.isShow = false;
        if (this.$mask != null) {
            this.$mask.css("animation-duration", this.defaults.aniSpeed + "ms");
            this.maskAniIn = "fadeIn animated";
            this.maskAniOut = "fadeOut animated";
        }
    }
    //显示遮罩层
    _showMask(callback) {
        this.$mask.show().addClass(this.maskAniIn);
    }
    //隐藏遮罩层
    _hideMask() {
        let self = this;
        this.$mask.removeClass(this.maskAniIn);
        this.$mask.addClass(this.maskAniOut);
    }
    _clearDelayTimer() {
        clearTimeout(this.delayTime);
        this.delayTime = null;
    }
    //事件绑定
    _registerEvent() {
        let self = this,
            callback = this.defaults.registerEvent;
        let $close = self.$widget.find(this.defaults.closeBtn);
        $close.off().on("mousedown", function () {
            self.layerHide();
        });
        for (let item in callback) {
            (function (key) {
                let $btn = self.$widget.find("." + key);
                $btn.off().on("mousedown", function () {
                    let $this = $(this);
                    let disable = $this.attr("data-disable");
                    if (self.defaults.autoHide.enable) {
                        self._clearDelayTimer();
                    }
                    if (!disable || disable == "false") {
                        callback[key].call(self, $this);
                    }
                });
            })(item);
        }
        if (this.$mask != null && this.defaults.modal.clickHide) {
            this.$mask.off().on("mousedown", function () {
                self.layerHide();
            });
            this.$widget.off().on("mousedown", function (e) {
                e.stopPropagation();
            });
        }
        //css3动画结束事件
        this.$widget.one('webkitAnimationEnd animationend', function () {
            if (self.isShow) {
                let autoHideConfig = self.defaults.autoHide;
                self.defaults.showCallback();
                if (autoHideConfig.enable) {
                    self.delayTime = setTimeout(function () {
                        self.layerHide();
                    }, autoHideConfig.delayTime);
                }
            } else {
                self.$widget.removeClass(self.aniOut[self.defaults.layerAni - 1] + " animated").hide();
                if (self.$mask != null) {
                    self.$mask.removeClass(self.maskAniOut).hide();
                }
                self.defaults.hideCallback();
            }
        });
    }
    //设置按钮文字
    setBtnText(btnName, text) {
        let $btn = this.$widget.find("." + btnName);
        $btn.val(text);
    }
    //启用按钮
    enableBtn(btnName) {
        let $btn = this.$widget.find("." + btnName);
        $btn.attr("data-disable", "false");
    }
    //禁用按钮
    disableBtn(btnName) {
        let $btn = this.$widget.find("." + btnName);
        $btn.attr("data-disable", "true");
    }
    /**
     * 设置对话框位置
     * @param Integer position 位置
     * 1 3 5
     *   7
     * 2 4 6
     * @param Object value 当position的值设置为8时,即自定义位置值{left:130,top:240}
     */
    setPosition(position, value) {
        let $el = this.$el;
        let viewSize = this.getViewSize();
        let winWidth = viewSize.winW;
        let winHeight = viewSize.winH;
        let dilogWidth = this.$widget.width();
        let dilogHeight = this.$widget.height();
        let marginValue = this.defaults.marginValue;
        switch (position) {
            case 1:
                this.$widget.css({
                    left: marginValue,
                    top: marginValue
                });
                break;
            case 2:
                this.$widget.css({
                    left: marginValue,
                    bottom: marginValue
                });
                break;
            case 3:
                this.$widget.css({
                    left: winWidth / 2 - dilogWidth / 2,
                    top: marginValue
                });
                break;
            case 4:
                this.$widget.css({
                    left: winWidth / 2 - dilogWidth / 2,
                    bottom: marginValue
                });
                break;
            case 5:
                this.$widget.css({
                    right: marginValue,
                    top: marginValue
                });
                break;
            case 6:
                this.$widget.css({
                    right: marginValue,
                    bottom: marginValue
                });
                break;
            case 7:
                this.$widget.css({
                    left: winWidth / 2 - dilogWidth / 2,
                    top: winHeight / 2 - dilogHeight / 2
                });
                break;
            case 8:
                this.$widget.css({
                    left: value.left,
                    top: value.top
                });
                break;
            default:
                break;
        }
    }
    /**
     * 设置弹出层显示的内容
     * @param string content 显示内容
     *
     */
    setContent(content) {
        this.$widget.find(".dilog-con").html(content);
    }
    //显示弹出层
    layerShow() {
        if (this.$mask != null) {
            this._showMask();
        }
        this.$widget.show().addClass(this.aniIn[this.defaults.layerAni - 1] + " animated");
        this.setPosition(this.defaults.position);
        this.isShow = true;
        this._registerEvent();
    }
    //隐藏弹出层
    layerHide() {
        this.$widget.removeClass(this.aniIn[this.defaults.layerAni - 1] + " animated");
        this.$widget.addClass(this.aniOut[this.defaults.layerAni - 1] + " animated");
        this.isShow = false;
        if (this.$mask != null) {
            this._hideMask();
        }
        this.defaults.beforeHideCallback();
    }
}
PopLayer.ani = { in: ["bounceInUp", "bounceInRight", "bounceInDown", "bounceInLeft", "zoomIn", "fadeInUp", "fadeInRight", "fadeInDown", "fadeInLeft", "fadeIn"],
    out: ["bounceOutDown", "bounceOutRight", "bounceOutUp", "bounceOutLeft", "zoomOut", "fadeOutDown", "fadeOutRight", "fadeOutUp", "fadeOutLeft", "fadeOut"]
};
export default PopLayer;