/**
 * 埋点统计
 * author:
 * modifyTime:2017-10-18
 */
let Piwik = {
    // 是否已加载
    loaded:false,
    /**
     * 初始化埋点追踪
     */
    init: function () {
        if(this.loaded) return false;
        window["_paq"] = window["_paq"] || [];
        let userName = localStorage.getItem("openId");
        window["_paq"].push(['setCustomVariable', 1, "UserName", userName, "visit"]);
        window["_paq"].push(["setDomains", ["wx.lovedriver.jumaps.com"]]);
        window["_paq"].push(['setDocumentTitle', document.title]);
        window["_paq"].push(['trackPageView']);
        window["_paq"].push(['enableLinkTracking']);
        window["_paq"].push(['setTrackerUrl', 'http://jmtj.jumaps.com/piwik/piwik.php']);
        window["_paq"].push(['setSiteId', 'ceshi']);
        let d = document,
            g = d.createElement('script'),
            s = d.getElementsByTagName('script')[0];
        g.type = 'text/javascript';
        g.async = true;
        g.defer = true;
        g.src = 'http://jmtj.jumaps.com/piwik/piwik.js';
        g.setAttribute("name", "piwik");
        try {
            let piwikTag = document.getElementsByName("piwik");
            if (piwikTag.length) {
                piwikTag.parentNode.removeChild(piwikTag);
            }
            s.parentNode.insertBefore(g, s);
        } catch (err) {}
        this.loaded = true;
    },

    /**
     * 记录行为
     *  @param {obj} $tag 埋点dom对象
     */
    recordBehavior: function ($tag) {
        let gpiSign = $tag.attr("data-gpi-sign");
        if (!gpiSign) return false;
        let gpiName = $tag.attr("data-gpi-text");
        let clientName = "驹马专车-微信端";
        window["_paq"].push(['trackEvent', clientName, gpiName, gpiSign]);
    },

    /**
     * 发送统计事件
     * @param {string} action 统计行为
     * @param {string} detail 事件详细描述 
     */
    trackEvent: function (action, detail) {
        try {
            console.log("埋点::", "驹马专车-微信端", action, detail);
        } catch (e) {}
        window["_paq"].push(['trackEvent', "驹马专车-微信端", action, detail]);
    }
}
export default Piwik;