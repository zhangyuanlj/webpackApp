/*
 * 定时器
 * author:张渊
 * modifyTime:2017-2-8
 */
import Zepto from 'jQuery';
class Timer {
    constructor(options) {
        this.defaults = {
            timeNum: 10,
            delay: 1000,
            everyCallback: function (currentTime) {
                return true;
            },
            endCallback: function (currentTime) {
                return true;
            }
        };
        this.defaults = $.extend(this.defaults, options);
        this.timerId = this.createTimer();
    }
    //创建定时器
    createTimer() {
        var timerId = null;
        var defaults = this.defaults;
        var timeNum = defaults.timeNum;
        var play = () => {
            timeNum--;
            if (timeNum && typeof defaults.everyCallback == "function") {
                defaults.everyCallback(timeNum);
            }
            if (timeNum <= 0) {
                this.clearTimer(timerId);
                if (typeof defaults.endCallback == "function") {
                    defaults.endCallback();
                }
                return;
            }
        };
        timerId = setInterval(play, defaults.delay);
        Timer.timer[timerId] = timerId;
        return timerId;
    }
    /**
     * 清除指定的计时器
     * @param integer timerId 计时器ID
     */
    clearTimer(timerId) {
        clearInterval(Timer.timer[timerId]);
        Timer.timer[timerId] = null;
    }
    //清除所有计时器
    clearAllTimer() {
        for (var i in Timer.timer) {
            this.clearTimer(i);
        }
        Timer.timer = {};
    }
    getTimer() {
        return Timer.timer;
    }
}
Timer.timer = {};
export default Timer;