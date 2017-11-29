import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import Route from 'utils/route.js';
import '../styles/viewport.style';
import tpl from '../tpl/viewport.tpl';
const hasHeaderStyleName = "c-viewport-has-header";
const hasNavStyleName = "c-viewport-has-nav";
/**
 * 主视图组件
 * 
 * @class Viewport
 * @extends {Component}
 */
class Viewport extends Component {
    constructor(options) {
        super();
        this.$app = $("#app");
        this.defaults = {
            App: null,
            Header: null,
            Nav: null
        };
        this.setOptions(options);
        this.render();
    }
    render() {
        let App = this.defaults.App;
        let Header = this.defaults.Header;
        let Nav = this.defaults.Nav;
        let viewportTmp = tpl;
        let headerRet = Header !== null ? Header.render() : "";
        let navRet = Nav !== null ? Nav.render() : "";
        viewportTmp = viewportTmp.replace("<header></header>", headerRet);
        viewportTmp = viewportTmp.replace("<nav></nav>", navRet);
        if (!$("#viewport").length) {
            this.$app.html(viewportTmp);
            this.$viewport = $("#viewport");
            this.$contentView = $("#viewport-content");
        }
        if (headerRet != "") {
            this.$viewport.addClass(hasHeaderStyleName);
            Header.registerEvent();
        }
        if (navRet != "") {
            this.$viewport.addClass(hasNavStyleName);
            this.setNavActive();
            Nav.registerEvent();
            App.hashChangeCallback = () => {
                this.setNavActive();
            };
        }
    }
    setNavActive() {
        let Nav = this.defaults.Nav;
        let moduleName = Route.getModuleName();
        Nav.setActive(moduleName);
    }
    getContentView(){
        return this.$contentView;
    }
    getHeader() {
        return this.defaults.Header !== null ? this.defaults.Header : null;
    }
    getNav() {
        return this.defaults.Nav !== null ? this.defaults.Nav : null;
    }
}
export default Viewport;