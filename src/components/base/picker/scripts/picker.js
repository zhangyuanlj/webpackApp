import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import IScrollModule from 'libs/iscroll.min.js';
import '../styles/picker.style';
import tpl from '../tpl/picker.tpl';
const ITEM_LINE = '<div class="c-picker-item-line"></div>';
const SELECTED_STYLE = "selected";
const TOP_EMPTY_NUM = 2;
const ITEM_CALSS_NAME = "item";
const SCROLL_SPEED = 500;
/**
 * 移动端选择器
 * 
 * @class Picker
 * @extends {Component}
 */
class Picker extends Component {
    constructor(options) {
        super();
        this.defaults = {
            $display: $("#picker"),
            itemHeight: 46,
            items: []
        };
        this.itemScroll = {};
        this.el = Picker.getEl();
        this.setOptions(options);
        this.create();
        this.registerEvent();
    }
    static getWidgetName() {
        return "picker";
    }
    static getEl() {
        return {
            $html: $("html"),
            $body: $("body")
        };
    }
    /**
     * 获取每个item的高度
     * 
     * @returns 每个item的高度
     * 
     * @memberof Picker
     */
    getItemHeight() {
        let itemHeight = this.defaults.itemHeight / window['viewportConfig'].designFontSize;
        let baseSize = parseFloat(this.el.$html.css("font-size"));
        return baseSize * parseFloat(itemHeight);
    }
    /**
     * 渲染每个Item
     * 
     * @param {array} list 每个Item的数据
     * @returns string 每个Item的html
     * @memberof Picker
     */
    renderItem(list) {
        let itemTemp = [];
        let itemLen = list.length;
        for (let j = 0; j < itemLen; j++) {
            let item = list[j];
            let styleName = item.selected ? ' class="' + ITEM_CALSS_NAME + ' ' + SELECTED_STYLE + '"' : ' class="' + ITEM_CALSS_NAME + '"';
            itemTemp.push('<li' + styleName + ' data-value="' + item.value + '">' + item.name + '</li>');
        }
        return itemTemp.join("\n");
    }
    create() {
        let $display = this.defaults.$display;
        let items = this.defaults.items;
        let itemsLen = items.length;
        let width = $display.width() / itemsLen;
        let snapH = this.getItemHeight();
        $display.height(snapH * (TOP_EMPTY_NUM * 2 + 1));
        let height = $display.height();
        $display.append(ITEM_LINE);
        for (let i = 0; i < itemsLen; i++) {
            let list = items[i].list;
            let itemLen = list.length;
            let id = `${Picker.getWidgetName()}-${items[i].name}`;
            let tmp = tpl.replace(/{id}/g, id);
            tmp = tmp.replace(/{width}/g, width);
            tmp = tmp.replace(/{height}/g, height);
            tmp = tmp.replace(/{item}/g, this.renderItem(list));
            $display.append(tmp);
            let self = this;
                let $selected = $("#" + id + " li").eq(selectedIndex - TOP_EMPTY_NUM)[0];
            this.destroyItem(id);
            this.itemScroll[id] = new IScrollModule.iScroll(id, {
                snap: "li",
                hScroll: false,
                vScrollbar: false,
                onBeforeScrollStart: null,
                onScrollEnd() {
                    let scrollEndCallback = items[i].scrollEndCallback;
                    let $scrollItem = $("#" + id + " ." + ITEM_CALSS_NAME);
                    if (this.pagesY.length > $scrollItem.length) {
                        this.pagesY.splice(0 - TOP_EMPTY_NUM * 2, TOP_EMPTY_NUM * 2);
                    }
                    let index = $.inArray(this.y, this.pagesY);
                    $scrollItem.removeClass(SELECTED_STYLE);
                    $scrollItem.eq(index).addClass(SELECTED_STYLE);
                    scrollEndCallback && scrollEndCallback(id);
                }
            });
            this.itemScroll[id].scrollToElement($selected, SCROLL_SPEED);
        }
    }
    /**
     * 更新指定的Item
     * 
     * @param {string} itemId  item的id
     * @param {array} list 更新的数据
     * @param {string} lastSelectedValue 需要更新的item最后选择的值
     * @memberof Picker
     */
    updateItem(itemId, list, lastSelectedValue) {
        let itemTemp = "<li></li><li></li>";
        itemTemp += this.renderItem(list) + itemTemp;
        $(`#${itemId} ul`).html(itemTemp);
        this.itemScroll[itemId].refresh();
        let $scrollItem = $(`#${itemId} .${ITEM_CALSS_NAME}`);
        let $selected = $(`#${itemId} .${ITEM_CALSS_NAME}[data-value='${lastSelectedValue}']`);
        $scrollItem.removeClass(SELECTED_STYLE);
        $selected.addClass(SELECTED_STYLE);
    }
    /**
     * 获取每一个滚动列表选中的值
     * 
     * @returns 选中的值
     * 
     * @memberof Picker
     */
    getSelectedValue() {
        let ret = {};
        for (let key in this.itemScroll) {
            let $selected = $("#" + key + " li[class*='" + SELECTED_STYLE + "']");
            ret[key] = {
                name: $selected.text(),
                value: $selected.attr("data-value")
            }
        }
        return ret;
    }
    registerEvent() {
        //修复滚动列表时,事件向上层冒泡,触发整个页面滚动的问题
        this.defaults.$display.off().on("touchstart", function (e) {
            return false;
        });
    }
    /**
     * 销毁指定id容器的滚动实例
     * 
     * @param {string} itemId 
     */
    destroyItem(itemId) {
        if (this.itemScroll[itemId]) {
            this.itemScroll[itemId].destroy();
            delete this.itemScroll[itemId];
        }
    }
    /**
     * 销毁所有滚动实例
     * 
     */
    destroy() {
        for (let key in this.itemScroll) {
            this.destroyItem(key);
        }
    }
}
export default Picker;
