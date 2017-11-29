import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import '../styles/slider.style';
import tpl from '../tpl/slider.tpl';
const mainView = "viewport";
const subviewClassName = "c-slider";
const aniSpeed = 500;
const easing = "ease-in-out";
/**
 * 实现原生二级页面滑动效果
 * 
 * @class Slider
 * @extends {Component}
 */
class Slider extends Component {
    constructor(options) {
        super();
        this.defaults = {
            $display: $("#app"),
            subViews: []
        };
        this.el = Slider.getEl();
        this.viewsList = {};
        this.currentScrollTop = {};
        this.setOptions(options);
        this.$display = this.defaults.$display;
        this.$showView = $("#" + mainView);
        this.render();
    }
    static getEl() {
        return {
            $win: $(window)
        };
    }
    render() {
        let winH = this.el.$win.height();
        let subViews = this.defaults.subViews;
        if (subViews.length) {
            subViews.forEach((item, index, viewsList) => {
                let styleName = item.styleName ? item.styleName : "";
                this.create(item.viewId, winH, styleName);
            });
        }
    }
    /**
     * 创建一个slider
     * 
     * @param {string} 视图id 
     * @param {integer} winH 窗口高度
     * @param {string} styleName 附加的样式名称,多个用空格分隔
     * @memberof Slider
     */
    create(viewId, winH, styleName) {
        if (!this.isExist(viewId)) {
            let temp = tpl.replace(/{id}/g, viewId);
            this.$display.append(temp);
            this.viewsList[viewId] = $("#" + viewId);
            this.viewsList[viewId].addClass(styleName).css("min-height", winH + "px");
        }
    }
    isExist(viewId) {
        if (this.viewsList[viewId]) {
            return true;
        }
        return false;
    }
    /**
     * 打开一个视图
     * 
     * @param {object} $prevView 前一个视图
     * @param {string} viewId 显示视图id
     * @param {function} callback 回调函数
     * @memberof Slider
     */
    show($prevView, viewId, callback) {
        try {
            let $showView = this.viewsList[viewId];
            let options = {
                translateX: 0,
                opacity: 1
            };
            this.$showView = $showView;
            this.currentScrollTop[viewId] = this.el.$win.scrollTop();
            $showView.animate(options, aniSpeed, easing, () => {
                $prevView.hide();
                this.el.$win.scrollTop(0);
                $showView.removeClass(subviewClassName).css({
                    "transform": "",
                    "-webkit-transform": "",
                    "opacity": ""
                });
                callback && callback();
            });
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * 关闭一个视图
     * 
     * @param {object} $prevView 前一个视图
     * @param {string} viewId 显示视图id
     * @param {function} callback 回调函数
     * @memberof Slider
     */
    hide($prevView, viewId, callback) {
        try {
            let $showView = this.viewsList[viewId];
            let options = {
                translateX: "100%",
                opacity: 0
            };
            let currentScrollTop = this.currentScrollTop[viewId];
            this.$showView = $prevView;
            $prevView.show();
            this.el.$win.scrollTop(currentScrollTop);
            $showView.addClass(subviewClassName).css({
                "transform": "translateX(0)",
                "-webkit-transform": "translateX(0)",
                "opacity": 1
            }).animate(options, aniSpeed, easing, () => {
                $showView.css({
                    "transform": "",
                    "-webkit-transform": "",
                    "opacity": ""
                });
                callback && callback();
            });
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * 获取打开的视图
     * 
     * @memberof Slider
     */
    getShowView() {
        try {
            return this.$showView;
        } catch (err) {
            console.log(err);
        }
    }
}
export default Slider;