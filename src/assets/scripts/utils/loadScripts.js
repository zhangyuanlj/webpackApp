import SYS_CONFIG from 'config';
//每个队列允许的最大脚本数量
const QUEUE_NUM = 30;
class ScriptsLoader {
    constructor() {}
    /**
     * 动态加载脚本
     * 
     * @param {array} scriptsList 脚本URL列表
     * @param {function} callback 成功回调
     * @param {string} version 附加的版本号
     */
    load(scriptsList, callback, version) {
        let scriptsLen = scriptsList.length;
        let loadIndex = 0;
        if (!version) {
            version = SYS_CONFIG.APP_VERSION;
        }
        let createScript = function (url, loadedCallback) {
            try {
                if (ScriptsLoader.loadedList[url]) {
                    loadedCallback();
                    return false;
                }
                let scriptEl = document.createElement("script");
                scriptEl.type = "text/javascript";
                scriptEl.setAttribute("name", url);
                if (scriptEl.readyState) {
                    scriptEl.onreadystatechange = function () {
                        if (scriptEl.readyState == "loaded" ||
                            scriptEl.readyState == "complete") {
                            scriptEl.onreadystatechange = null;
                            loadedCallback();
                        }
                    };
                } else {
                    scriptEl.onload = function () {
                        loadedCallback();
                    };
                }
                ScriptsLoader.loadedList[url] = url;
                //如果加载第三方脚本,则不加版本号
                if (url.indexOf("http") == -1) {
                    url += "?v=" + version;
                }
                scriptEl.src = url;
                document.body.appendChild(scriptEl);
            } catch (err) {
                console.error(url + "加载失败,请刷新重试!\n" + err);
            }
        };
        let startCreate = function (index) {
            let loadUrl = scriptsList[index];
            index++;
            createScript(loadUrl, function () {
                if (index == scriptsLen) {
                    callback && callback.call(self);
                } else {
                    startCreate(index);
                }
            });
        };
        if (scriptsLen <= QUEUE_NUM) {
            startCreate(loadIndex);
        } else {
            console.warn("每次只允许加载:" + QUEUE_NUM + "个脚本！");
        }
    }
}
ScriptsLoader.loadedList = {};
export default ScriptsLoader;