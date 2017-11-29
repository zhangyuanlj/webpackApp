/*
 * 入口脚本
 * author:张渊
 * modifyTime:2017-06-02
 */
import SYS_CONFIG from '../build/config.js';
import Zepto from 'jQuery';
import Http from 'utils/httpRequest.js';
import Route from 'utils/route.js';
import DateTime from 'utils/dateTime.js';
import Progress from 'components/base/progress/install.js';
import Viewport from 'components/base/viewport/install.js';
class App {
    constructor(parentModule, entryModule) {
        this.$win = $(window);
        //父模块
        this.parentModule = parentModule;
        //入口模块
        this.entryModule = entryModule ? entryModule : "index";
        //viewport组件实例
        this.viewport = null;
        //已经加载的模块列表
        this.loadedModules = {};
        //当前模块
        this.currentModule = null;
        //进度条实例
        this.Progress = new Progress();
        //首次加载标识
        this.firstLoad = false;
        //页面hash值改变事件自定义方法
        this.hashChangeCallback = () => {};
    }
    /**
     * 渲染模块
     * @param string moduleName 模块名称
     * @param object parameters 地址栏参数
     */
    render(moduleName, parameters) {
        try {
            if (parameters) {
                console.log("\n\n");
                if (SYS_CONFIG.environment != "product") {
                    let date = DateTime.getDateObj();
                    let dateTime = DateTime.formateDateTime(date, "YYYY年MM月DD日 hh:ss:mm");
                    console.log(dateTime);
                }
                console.log("捕获的浏览器参数为:\n");
                console.log(parameters);
            }
            let lastLoadModule = this.loadedModules[moduleName];
            if (this.currentModule && this.currentModule.destroy && lastLoadModule !== this.currentModule) {
                console.log(this.currentModule);
                this.currentModule.destroy();
            }
            if (!this.loadedModules[moduleName]) {
                let load = require("bundle-loader?lazy!src/modules/" + this.parentModule + "/views/" + moduleName + "/" + moduleName + ".js");
                if (!this.firstLoad) {
                    this.Progress.start();
                    this.Progress.done();
                    this.firstLoad = true;
                }
                load((Module) => {
                    this.loadedModules[moduleName] = new Module.default(this.viewport, parameters);
                    this.currentModule = this.loadedModules[moduleName];
                    this.$win.scrollTop(0);
                    this.modulesLoadLog();
                    console.log("\n" + moduleName + "模块加载成功！");
                });
            } else {
                if (lastLoadModule === this.currentModule) {
                    if (lastLoadModule.update) {
                        lastLoadModule.update(this.viewport, parameters);
                    }
                    this.modulesLoadLog();
                    console.log("\n" + moduleName + "模块执行更新操作!");
                } else {
                    lastLoadModule.init(this.viewport, parameters);
                    this.currentModule = lastLoadModule;
                    this.$win.scrollTop(0);
                    this.modulesLoadLog();
                    console.log("\n路由发生改变," + moduleName + "模块重新初始化!");
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
    run() {
        let moduleName = Route.getModuleName();
        let parameters = Route.getParameters();
        if (moduleName == null) {
            moduleName = this.entryModule;
        }
        //在模块渲染之前，重置http请求
        Http.reset();
        this.render(moduleName, parameters);
        this.hashChangeCallback(moduleName);
    }
    //模块加载日志
    modulesLoadLog() {
        console.log("已经加载的模块：\n");
        console.log(this.loadedModules);
    }
    //绑定hashChange事件
    hashChangeEvent() {
        window.addEventListener("hashchange", (e) => {
            this.run();
        }, false);
    }
    //启动应用
    start() {
        this.run();
        this.hashChangeEvent();
    }
}
export default App;