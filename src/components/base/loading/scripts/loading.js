import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import '../styles/loading.style';
import tpl from '../tpl/loading.tpl';
/**
 * 页面加载组件
 * 
 * @class Loading
 * @extends {Component}
 */
class Loading extends Component {
    constructor() {
        super();
        this.queryEl = Loading.getEl();
        this.create();
    }
    static getEl() {
        return {
            $body: $("body")
        };
    }
    static getWidgetName() {
        return "loading";
    }
    static show() {
        Loading.$el.show();
    }
    hide() {
        Loading.$el.hide();
    }
    create() {
        this.id = this.setId(Loading.getWidgetName());
        let tplHtml = tpl.replace(/{id}/g, this.id);
        this.remove();
        this.queryEl.$body.append(tplHtml);
        Loading.$el = $("#" + this.id);
    }
    remove() {
        if (Loading.$el !== null) {
            Loading.$el.remove();
        }
    }
}
Loading.$el = null;
export default Loading;