import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import Loading from 'components/base/loading/install.js';
import Helper from 'utils/helper.js';
import Template from 'utils/template.js';
import 'utils/templateHelper.js';
import '../styles/nav.style';
import tpl from '../tpl/nav.tpl';
const tabActiveClass = "active";
/**
 * App导航组件
 * 
 * @class Nav
 * @extends {Component}
 */
class Nav extends Component {
    constructor(options) {
        super();
        this.defaults = {
            data: []
        };
        this.setOptions(options);
    }
    render() {
        let data = this.defaults.data;
        let html = "";
        if (data.length) {
            let ret = {
                list: data
            };
            let render = Template.compile(tpl);
            html = render(ret);
        }
        return html;
    }
    /**
     * 设置当前选tab为选中状态 此方法传递给app模块的hashchange回调方法调用
     * 
     * @param {string} moduleName 当前模块的名称
     * @memberof Nav
     */
    setActive(moduleName) {
        let $nav = $("#c-nav .item");
        if ($nav) {
            $nav.removeClass(tabActiveClass);
            let $current = $("#c-nav li[data-url='" + moduleName + "']");
            if (moduleName == null) {
                $current = $("#c-nav li").eq(0);
            }
            $current && $current.addClass(tabActiveClass);
        }
    }
    /**
     * 更新新消息提醒数字
     * 
     * @param {string} name 要更新item的name 
     * @param {integer} num 消息数
     * @memberof Nav
     */
    setNewsNum(name, num) {
        let $item = $(`#c-nav .item[data-url='${name}']`);
        $item.find(".num").text(num);
    }
    getRedirectUrl(url) {
        let baseUrl = Helper.getBaseUrl();
        let redirectUrl = `${baseUrl}${SYS_CONFIG.ENTRY_URL}#/${url}/`;
        return redirectUrl;
    }
    registerEvent() {
        let $nav = $("#c-nav .item");
        let self = this;
        $nav.off().on("mousedown", function (e) {
            let $this = $(this);
            let url = $this.attr("data-url");
            if (location.href.indexOf(url) != -1) {
                return false;
            }
            let index = $this.index();
            let redirectUrl = self.getRedirectUrl(url);
            let callback = self.defaults.data[index].callback;
            $nav.removeClass(tabActiveClass);
            $this.addClass(tabActiveClass);
            Helper.redirect(redirectUrl);
            Loading.show();
            callback && callback($this, index);
        });
    }
}
export default Nav;