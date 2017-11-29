import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import '../styles/upPullRefresh.style';
import tpl from '../tpl/upPullRefresh.tpl';
/**
 * 上拉加载,下拉刷新
 * 
 * @class UpPullRefresh
 * @extends {Component}
 */
class UpPullRefresh extends Component {
    constructor(options) {
        super();
        this.defaults = {
            $display: $("#view"),
            listContent: "",
            up: {
                active: true,
                callback() {
                    return true;
                }
            },
            pull: {
                active: true,
                maxDistan: 70,
                speed: 400,
                callback() {
                    return true;
                }
            }
        };
        this.setOptions(options);
        this.create();
        this.isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
        // this.hasTouch = "ontouchstart" in window && !this.isTouchPad;
        this.hasTouch = true;
        this.el = this._queryEl();
        this.startTouchX = 0;
        this.endTouchX = 0;
        this.startTouchY = 0;
        this.endTouchY = 0;
        this.opacity = 0;
        this.angle = 0;
        this.isLock = false;
        this.isCanDo = false;
        this.scrollTop = this.el.$win.scrollTop();
        this.maxDistan = this.defaults.pull.maxDistan;
        //this.pullLoadHtml = this.$pull.html();
        this.reset();
    }
    static getWidgetName() {
        return "upPullRefresh";
    }
    _queryEl() {
        return {
            $win: $(window),
            $doc: $(document),
            $body: $("body")
        };
    }
    //检测是否滚动到底部
    _isScrollBottom(scrollTop) {
        let defaults = this.defaults;
        let el = this.el;
        let pullLoadH = this.$pull.height();
        let bottomValue = el.$doc.height() - el.$win.height() - pullLoadH;
        let isBottom = bottomValue > 0 ? this.scrollTop >= bottomValue : false;
        return isBottom;
    }
    _upFunc() {
        let self = this;
        let scrollFunc = function ($this) {
            self.scrollTop = $this.scrollTop();
            self._resetPull(true);
            if (self._isScrollBottom(self.scrollTop)) {
                self.unUpEvent();
                self.upLoadShow();
                self.defaults.up.callback.call(self);
            }
        };
        this.el.$win.off().on({
            scroll() {
                scrollFunc($(this));
            }
        });
    }
    //重置下拉刷新
    _resetPull(isScroll) {
        let self = this;
        this.isLock = false;
        this.isCanDo = false;
        this.angle = 0;
        this.opacity = 0;
        this.startTouchX = 0;
        this.endTouchX = 0;
        this.startTouchY = 0;
        this.endTouchY = 0;
        if (isScroll) {
            this.$pull.css({
                opacity: 0,
                visibility: "hidden",
                "-webkit-transform": "translate3d(0,0,0) rotate(0deg) scale(0)"
            });
        }
    }
    //下拉刷新回弹效果
    _pullBound(startTouchY, endTouchY) {
        let self = this;
        let moveDistan = Math.abs(endTouchY - startTouchY);
        this.angle = moveDistan * 5;
        this.opacity += moveDistan / 1000;
        if (this.opacity >= 1) {
            this.opacity = 1;
        }
        if (moveDistan >= this.maxDistan) {
            //this.setPullLoadHtml("↑ 松开立即刷新");
            moveDistan = this.maxDistan;
            this.angle = moveDistan * 5;
            this.opacity = 1;
        } else {
            //this.setPullLoadHtml(this.pullLoadHtml);
        }
        this.$pull.css({
            opacity: self.opacity,
            "-webkit-transform": "translate3d(0," + moveDistan + "px, 0) rotate(" + self.angle + "deg) scale(1)"
        });
    }
    _startFunc(e) {
        this.scrollTop = this.el.$win.scrollTop();
        if (this.scrollTop <= 0 && !this.isLock) {
            let even = typeof event == "undefined" ? e : event;
            this.isLock = true;
            this.isCanDo = true;
            this.startTouchX = this.hasTouch ? even.targetTouches[0].pageX : even.pageX;
            this.startTouchY = this.hasTouch ? even.targetTouches[0].pageY : even.pageY;
        }
    }
    _moveFunc(e) {
        if (this.scrollTop <= 0 && this.isCanDo) {
            let even = typeof event == "undefined" ? e : event;
            this.endTouchX = this.hasTouch ? even.targetTouches[0].pageX : even.pageX;
            this.endTouchY = this.hasTouch ? even.targetTouches[0].pageY : even.pageY;
            if (this.startTouchY < this.endTouchY && this.endTouchX - this.startTouchX <= 30) {
                this.$pull.css({
                    visibility: "visible"
                });
                this._pullBound(this.startTouchY, this.endTouchY);
                even.preventDefault();
            } else {
                this.isLock = false;
            }
        }
    }
    _endFunc(e) {
        if (this.isCanDo) {
            this.isCanDo = false;
            this.isLock = false;
            if (this.endTouchY - this.startTouchY >= this.maxDistan) {
                this.unPullEvent();
                //this.setPullLoadHtml("<i></i> 正在刷新");
                this.pullLoadAni();
            } else {
                this.pullLoadHide();
            }
        }
    }
    _pullFunc() {
        let self = this;
        this.unPullEvent();
        this.$widget.on({
            touchstart(e) {
                self._startFunc(e);
            },
            touchmove(e) {
                self._moveFunc(e);
            },
            touchend(e) {
                self._endFunc(e);
            },
            touchcancel(e) {
                self._endFunc(e);
            }
        });
    }
    create() {
        let id = this.setId(UpPullRefresh.getWidgetName());
        let tplHtml = tpl.replace(/{id}/g, id);
        tplHtml = tplHtml.replace(/{content}/g, this.defaults.listContent);
        this.defaults.$display.html(tplHtml);
        this.$widget = $("#" + id);
        this.$up = this.$widget.find(".c-pull-up");
        this.$pull = this.$widget.find(".c-pull-down");
    }
    //卸载下拉加载事件
    unUpEvent() {
        this.el.$win.off("scroll");
    }
    //卸载上拉加载事件
    unPullEvent() {
        let defaults = this.defaults;
        this.$pull.off("touchstart");
        this.$pull.off("touchmove");
        this.$pull.off("touchend");
    }
    //重置下拉事件
    resetPull(){
        this._resetPull(true);
        this._pullFunc();
    }
    //重置组件
    reset() {
        let defaults = this.defaults;
        if (defaults.up.active) {
            this._upFunc();
        }
        if (defaults.pull.active) {
            this.resetPull();
        }
    }
    upLoadShow() {
        this.$up.css("visibility", "visible");
    }
    upLoadHide() {
        this.$up.css("visibility", "hidden");
    }
    setUpLoadHtml(innerHtml) {
        this.$up.html(innerHtml);
    }
    //        setPullLoadHtml (innerHtml) {
    //            this.$pull.html(innerHtml);
    //        },
    pullLoadHide(callback) {
        let self = this;
        let defaults = this.defaults;
        this.$pull.animate({
            opacity: 0,
            transform: "translate3d(0,0,0) rotate(" + self.angle + "deg) scale(1)"
        }, defaults.pull.speed, function () {
            self._resetPull(true);
            if ($.type(callback) == "function") {
                callback.call(self);
            }
        });
    }
    //下拉加载拉取数据动画
    pullLoadAni() {
        let self = this;
        let defaults = this.defaults;
        let speed = defaults.pull.speed;
        let endRotate = (self.angle + 360) + "deg";
        this.defaults.pull.callback.call(this);
        this.$pull.animate({
            transform: "translate3d(0," + self.maxDistan + "px,0) rotate(" + endRotate + ") scale(1)"
        }, speed, function () {
            let $this = $(this);
            $this.animate({
                transform: "translate3d(0," + self.maxDistan + "px,0) rotate(" + endRotate + ") scale(0)",
                opacity: 0
            }, speed / 3, function () {
                self.resetPull();
            });
        });
    }
    setPullList($pull) {
        this.$pull = $pull;
    }
    getListContentView() {
        return this.getId() + "-content";
    }
}
export default UpPullRefresh;