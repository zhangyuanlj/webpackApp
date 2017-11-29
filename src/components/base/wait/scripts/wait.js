import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import '../styles/wait.style';
import tpl from '../tpl/wait.tpl';
const modal = ".c-modal";
/**
 * 请求等待组件
 * 
 * @class Wait
 * @extends {Component}
 */
class Wait extends Component {
    constructor(options) {
        super();
        this.defaults = {
            content: "正在加载"
        };
        this.setOptions(options);
        this.create();
    }
    static getWidgetName() {
        return "wait";
    }
    create() {
        let self = this;
        let $body = $("body");
        let id = this.setId(Wait.getWidgetName());
        let tplHtml = tpl.replace(/{id}/g, id);
        tplHtml = tplHtml.replace(/{content}/g, this.defaults.content);
        this.remove();
        $body.append(tplHtml);
        this.$widget = $("#" + id);
    }
    remove() {
        let $wait = $(".c-wait");
        if ($wait.length) {
            $wait.parent(modal).remove();
        }
    }
}
export default Wait;