/*
 * 日期时间工具类
 * author:张渊
 * modifyTime:2017-6-4
 */
import Zepto from 'jQuery';
class DateTime {
    static getWeek(dayIndex) {
        var week = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return week[dayIndex];
    }
    /**
     * 获取日期对象
     * @options string dateTime 标准的日期时间字符串 2017-06-04 15:30:02
     * @options integer dayCount dayCount天后的日期时间信息,0为当天,负数则向前
     */
    static getDateObj(options) {
        let date = null;
        let defaults = {
            dateTime: "",
            dayCount: 0
        };
        $.extend(defaults, options);
        let dateTime = defaults.dateTime;
        let dayCount = defaults.dayCount;
        if (dateTime != "") {
            date = new Date(Date.parse(dateTime.replace(/-/g, "/")));
        } else {
            date = new Date();
        }
        if (dayCount != null) {
            date.setDate(date.getDate() + dayCount);
        }
        return date;
    }
    /**
     * 获取详细的日期时间信息
     * @param object date 日期对象
     * @return object 详细的日期时间信息
     */
    static getDateInfo(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dayIndex = date.getDay();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return {
            year: year,
            month: month.toString().length === 1 ? '0' + month : month,
            day: day.toString().length === 1 ? '0' + day : day,
            week: DateTime.getWeek(dayIndex),
            hours: hours.toString().length === 1 ? '0' + hours : hours,
            minute: minute.toString().length === 1 ? '0' + minute : minute,
            second: second.toString().length === 1 ? '0' + second : second
        };
    }
    /**
     * 删除自动更新timer
     * @param integer timerId
     */
    static clearUpDateTimer(timerId) {
        if (timerId) {
            clearInterval(DateTime.upDateTimer[timerId]);
            delete DateTime.upDateTimer[timerId];
        } else {
            let upDateTimer = DateTime.upDateTimer;
            for (let key in upDateTimer) {
                clearInterval(DateTime.upDateTimer[key]);
                delete DateTime.upDateTimer[key];
            }
        }
    }
    /**
     * 获取DOM对象上绑定的timerId
     * @options object $display 显示日期时间的DOM对象
     */
    static getUpDateTimerId($display) {
        return parseInt($display.attr("data-timerId"));
    }
    static formateDateTime(date, format) {
        let ret = format;
        let dateInfo = DateTime.getDateInfo(date);
        let o = {
            "M+": dateInfo.month,
            "D+": dateInfo.day,
            "h+": dateInfo.hours,
            "m+": dateInfo.minute,
            "s+": dateInfo.second
        }
        if (/(Y+)/.test(format)) {
            ret = ret.replace(RegExp.$1, (dateInfo.year + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                ret = ret.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        if (/(W)/.test(format)) {
            ret = ret.replace(RegExp.$1, dateInfo.week);
        }
        return ret;
    }
    /**
     * 显示当前日期时间
     * @options object $display 显示日期时间的DOM对象
     * @options string formate 显示格式
     * @options boolean autoUpdate 是否自动更新
     */
    static showCurrentDateTime(options) {
        let defaults = {
            $display: "#dateTime",
            formate: "YYYY-MM-DD",
            autoUpdate: false
        };
        $.extend(defaults, options);
        let format = defaults.formate;
        let render = function () {
            let date = DateTime.getDateObj();
            let ret = DateTime.formateDateTime(date, format);
            defaults.$display.html(ret);
        };
        render();
        if (defaults.autoUpdate) {
            DateTime.timerId++;
            defaults.$display.attr("data-timerId", DateTime.timerId);
            DateTime.clearUpDateTimer(DateTime.timerId);
            DateTime.upDateTimer[DateTime.timerId] = setInterval(() => {
                render();
            });
        }
    }
    /**
     *
     * 计算两个日期时间段内所有日期 
     * @param string start 开始日期,格式为YYYY-MM-DD
     * @param string end 结束日期,格式为YYYY-MM-DD
     * @return array 日期列表
     *
     */
    static getDateScope(start, end) {
        let startDate = DateTime.getDateObj({
            dateTime: start,
            dayCount: null
        });
        let endDate = DateTime.getDateObj({
            dateTime: end,
            dayCount: null
        });
        let ret = [];
        while ((endDate.getTime() - startDate.getTime()) >= 0) {
            let year = startDate.getFullYear();
            let month = startDate.getMonth() + 1;
            let day = startDate.getDate();
            month = month.toString().length == 1 ? "0" + month.toString() : month;
            day = day.toString().length == 1 ? "0" + day : day;
            ret.push({
                year: year,
                month: month,
                day: day,
                str: `${year}-${month}-${day}`
            });
            startDate.setDate(startDate.getDate() + 1);
        }
        return ret;
    }
    /**
     *
     * 获取当前日期之前或者之后dayCount天的日期列表
     * @param integer dayCount dayCount为负数时则为当前日期之前
     *
     */
    static getDateList(dayCount) {
        let startDate = DateTime.getDateObj({
            dayCount: 1
        });
        let endDate = DateTime.getDateObj({
            dayCount: dayCount
        });
        let formate = "YYYY-MM-DD";
        if (dayCount < 0) {
            startDate = DateTime.getDateObj({
                dayCount: dayCount
            });
            endDate = DateTime.getDateObj({
                dayCount: -1
            });
        }
        startDate = DateTime.formateDateTime(startDate, formate);
        endDate = DateTime.formateDateTime(endDate, formate);
        return DateTime.getDateScope(startDate, endDate);
    }
    /**
     * 获得传入日期时间与当前日期时间的差值
     * 
     * @static
     * @param {string} dateTimne 传入日期时间,标准日期时间字符串
     * @returns 传入日期时间与当前日期时间的差值
     * @memberof DateTime
     */
    static getDifference(dateTime) {
        let date = DateTime.getDateObj({
            dateTime: dateTime,
            dayCount: null
        });
        let currentDate = DateTime.getDateObj();
        return date.getTime() - currentDate.getTime();
    }
}
DateTime.timerId = 0;
DateTime.upDateTimer = {};
export default DateTime;