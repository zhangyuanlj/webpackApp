import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import '../styles/progress.style';
import tpl from '../tpl/progress.tpl';
/*
 * 页面进度条
 * author:张渊
 * modifyTime:2017-10-12
 */
class Progress extends Component {
    constructor(options) {
        super();
        this.$el = this.getEl();
        this.defaults = {
            delay: 5000,
            callback: function () {
                return true;
            }
        };
        this.loadTimer = null;
        this.speed = 900;
        this.setOptions(options);
        this.defaults.delay = this.defaults.delay < 1000 ? 1000 : this.defaults.delay;
        this.create();
    }
    static getWidgetName() {
        return "progress";
    }
    create() {
        let self = this;
        let id = this.setId(Progress.getWidgetName());
        let template = tpl.replace(/{id}/g, id);
        if (this.$widget != null && this.$widget.length) {
            this.destroy();
        }
        this.$el.$body.append(template);
        this.$widget = $("#" + id);
        super.show();
        this.setStatus(0);
    }
    setStatus(progress) {
        this.$widget.attr("data-progress", progress);
    }
    loader() {
        let width = parseFloat(this.$widget.attr("data-progress"));
        let progress = width + Math.random(0, 1) / 10;
        if (progress > 1) {
            progress = 1;
            this.removeProgress(() => {
                this.defaults.callback.apply(this);
            });
        } else {
            this.updateProgress(progress);
            this.loadTimer = setTimeout(() => {
                this.loader();
            }, this.defaults.delay);
        }
    }
    getLoaderTimer() {
        return this.loadTimer;
    }
    clearLoaderTimer() {
        clearTimeout(this.loadTimer);
        this.loadTimer = null;
    }
    /**
     * 更新进度条
     * @param integer progressValue 当前进度
     * @param function callback 回调函数
     */
    updateProgress(progressValue, callback) {
        let self = this;
        let width = progressValue * 100 + "%";
        this.setStatus(progressValue);
        this.$widget.animate({
            width: width
        }, self.speed, "swing", function () {
            if ($.isFunction(callback)) {
                callback(progressValue);
            }
        });
    }
    removeProgress(callback) {
        this.$widget.animate({
            opacity: 0
        }, this.speed, () => {
            this.destroy();
            if ($.isFunction(callback)) {
                callback();
            }
        });
    }
    getStatus() {
        return parseFloat(this.$widget.attr("data-progress"));
    }
    start() {
        let progressValue = this.getStatus();
        this.setStatus(progressValue);
        this.loader();
    }
    done() {
        this.clearLoaderTimer();
        this.updateProgress(1, () => {
            this.removeProgress(() => {
                this.defaults.callback.apply(this);
            });
        });
    }
    destroy() {
        if (this.loadTimer != null) {
            this.clearLoaderTimer();
        }
        super.destroy();
    };
}
export default Progress;