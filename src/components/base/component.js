/*
 * 公共组件类
 * author:张渊
 * modifyTime:2017-06-01
 */
import Zepto from 'jQuery';
class Component {
    constructor(options) {
        this.$widget = null;
        this.defaults = {};
    }
    /**
     * 设置组件配置参数
     * @param object options 配置参数
     */
    setOptions(options) {
        if (options) {
            $.extend(true, this.defaults, options);
        }
    }
    /**
     * 设置控件宽度
     * @param integer width 宽度
     */
    setWidth(width) {
        this.$widget.width(width);
    }
    /**
     * 设置控件高度
     * @param integer height 高度
     */
    setHeight(height) {
        this.$widget.height(height);
    }
    /**
     * 设置控件大小
     * @param integer width 宽度
     * @param integer height 高度
     */
    setSize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }
    /**
     * 设置控件横坐标
     * @param integer left 横坐标
     */
    setLeft(left) {
        this.$widget.css("left", left ? left + "px" : left);
    }
    /**
     * 设置控件纵坐标
     * @param integer top 纵坐标
     */
    setTop(top) {
        this.$widget.css("top", top ? top + "px" : top);
    }
    /**
     * 设置控件位置
     * @param integer left 横坐标
     * @param integer top 纵坐标
     */
    setPosition(left, top) {
        this.setLeft(left);
        this.setTop(top);
    }
    /**
     * 设置组件id
     * @param string name 组件名称
     */
    setId(name) {
        var id = new Date().getTime().toString(36);
        id += Math.random().toString(36).substr(3);
        return name + "-" + id;
    }
    //获取常用dom节点
    getEl() {
        return {
            $doc: $(document),
            $win: $(window),
            $body: $("body")
        };
    }
    //获取视窗的大小
    getViewSize() {
        var $el = this.getEl();
        var docW = $el.$doc.width();
        var docH = $el.$doc.height();
        var winW = $el.$win.width();
        var winH = $el.$win.height();
        var bodyW = $el.$body.width();
        var bodyH = $el.$body.height();
        return {
            docW: docW,
            docH: docH,
            winW: winW,
            winH: winH,
            bodyW: bodyW,
            bodyH: bodyH
        };
    }
    /**
     * 获取控件大小
     * @return object 控件大小
     */
    getSize() {
        var width = this.$widget.width(),
            height = this.$widget.height();
        if (width === null) {
            width = 0;
        }
        if (height === null) {
            height = 0;
        }
        return {
            width: width,
            height: height
        }
    }
    //获取组件id
    getId() {
        return this.$widget.attr("id");
    }
    /**
     * 获取控件位置
     * @return object 元素位置
     */
    getPosition() {
        var left = parseFloat(this.$widget.css("left")),
            top = parseFloat(this.$widget.css("top"));
        if (isNaN(left)) {
            left = 0;
        }
        if (isNaN(top)) {
            top = 0;
        }
        return {
            left: left,
            top: top
        }
    }
    show() {
        this.$widget.show();
    }
    hide() {
        this.$widget.hide();
    }
    //当前控件是否处于显示状态
    isShow() {
        if (this.$widget.css("display") != "none" || this.$widget.css("visibility") != "hidden") {
            return true;
        } else {
            return false;
        }
    }
    destroy() {
        this.$widget.remove();
        this.$widget = null;
    }
}
export default Component;