import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import Template from 'utils/template.js';
import 'utils/templateHelper.js';
import tpl from '../tpl/header.tpl';
import '../styles/header.style';
/**
 * App页头组件
 * 
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
    constructor(options) {
        super();
        this.defaults = {
            data: null
        };
        this.setOptions(options);
    }
    static getWidgetName() {
        return "header";
    }
    render() {
        let html = "";
        let data = this.defaults.data;
        if (data !== null) {
            let ret = {
                data: data
            };
            if (!this.id) {
                this.id = this.setId(Header.getWidgetName());
            }
            let tplHtml = tpl.replace(/{id}/g, this.id);
            let render = Template.compile(tplHtml);
            html = render(ret);
        }
        return html;
    }
    /**
     * 重置页头组件标题 
     * 
     * @param {string} title 标题
     * @memberof Header
     */
    setTitle(title) {
        this.id.find(".text").text(title);
    }
    /**
     * 更新页头组件
     * 
     * @param {object} data 组件数据 
     * @memberof Header
     */
    update(data) {
        this.defaults.data = data;
        let html = this.render();
        $(`#${this.id}`).html(html);
        this.registerEvent();
    }
    registerEvent() {
        let $header = $(`#${this.id} .icon`);
        let self = this;
        $header.off().on("mousedown", function (e) {
            let $this = $(this);
            let name = $this.attr("data-name");
            let callback = self.defaults.data.callback[name];
            callback && callback.call(self, $this);
        });
    }
}
export default Header;