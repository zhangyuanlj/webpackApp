import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import DateTime from 'utils/dateTime.js';
import Pannel from 'components/base/pannel/scripts/pannel.js';
import Picker from './picker.js';
/**
 * 预约选择器
 * 
 * @class OrderPicker
 * @extends {Component}
 */
class OrderPicker extends Component {
    constructor(options) {
        super();
        this.defaults = {
            selectValue: null,
            pannelTitle: "预约时间",
            cancel: {
                text: "取消",
                callback: () => {
                    return true;
                }
            },
            confirm: {
                text: "确定",
                callback: () => {
                    return true;
                }
            }
        };
        this.setOptions(options);
        this.selectValue = this.defaults.selectValue;
    }
    initPannel() {
        let self = this;
        let defaults = this.defaults;
        this.pannel = new Pannel({
            titleConfig: {
                text: defaults.pannelTitle,
                cancel: {
                    show: true,
                    text: defaults.cancel.text,
                    callback: () => {
                        defaults.cancel.callback.call(self);
                    }
                },
                confirm: {
                    show: true,
                    text: defaults.confirm.text,
                    callback: () => {
                        defaults.confirm.callback.call(self);
                    }
                }
            }
        });
    }
    conversion() {
        let arr = [];
        if (this.selectValue !== null) {
            let tmp = [];
            arr = this.selectValue.split(" ");
            tmp = tmp.concat(arr[0], arr[1].split(":"));
            this.selectValueObj = {
                date: tmp[0],
                hour: tmp[1],
                minute: tmp[2],
                seconds: tmp[3]
            };
        }
    }
    getDays() {
        let FORMAT = "YYYY-MM-DD";
        this.today = DateTime.getDateObj({
            dayCount: 0
        });
        let tomorrow = DateTime.getDateObj({
            dayCount: 1
        });
        let afterTomorrow = DateTime.getDateObj({
            dayCount: 2
        });
        let todayStr = DateTime.formateDateTime(this.today, FORMAT);
        let tomorrowStr = DateTime.formateDateTime(tomorrow, FORMAT);
        let afterTomorrowStr = DateTime.formateDateTime(afterTomorrow, FORMAT);
        this.today = DateTime.getDateInfo(this.today);
        let selectedIndex = 0;
        let days = [{
            name: "今天",
            value: todayStr
        }, {
            name: "明天",
            value: tomorrowStr
        }, {
            name: "后天",
            value: afterTomorrowStr
        }];
        if (this.selectValue === null) {
            selectedIndex = 0;
        } else {
            if (this.selectValueObj.date == todayStr) {
                selectedIndex = 0;
            } else if (this.selectValueObj.date == tomorrowStr) {
                selectedIndex = 1;
            } else if (this.selectValueObj.date == afterTomorrowStr) {
                selectedIndex = 2;
            }
        }
        days[selectedIndex]["selected"] = true;
        return days;
    }
    getHours() {
        let hours = [];
        let selectedIndex = 0;
        for (let i = 0; i < 24; i++) {
            let tmp = i.toString();
            let selectHour = this.today.hours.toString();
            hours.push({
                name: tmp,
                value: tmp.length < 2 ? "0" + tmp : tmp
            });
            if (this.selectValue !== null) {
                selectHour = this.selectValueObj.hour;
            }
            if (selectHour == tmp) {
                selectedIndex = i;
            }
        }
        hours[selectedIndex]["selected"] = true;
        return hours;
    }
    getMinutes() {
        let minutes = [];
        let selectedIndex = 0;
        for (let i = 0; i < 60; i++) {
            let tmp = i.toString();
            let selectMinute = this.today.minute.toString();
            minutes.push({
                name: tmp,
                value: tmp.length < 2 ? "0" + tmp : tmp
            });
            if (this.selectValue !== null) {
                selectMinute = this.selectValueObj.minute;
            }
            if (selectMinute == tmp) {
                selectedIndex = i;
            }
        }
        minutes[selectedIndex]["selected"] = true;
        return minutes;
    }
    render() {
        let self = this;
        this.conversion();
        this.days = this.getDays();
        this.hours = this.getHours();
        this.minutes = this.getMinutes();
        this.initPannel();
        this.piker = new Picker({
            $display: self.pannel.getScrollView(),
            itemHeight: 100,
            items: [{
                    name: "date",
                    list: self.days
                },
                {
                    name: "hours",
                    list: self.hours,
                },
                {
                    name: "minutes",
                    list: self.minutes
                }
            ]
        });
    }
    getValue() {
        let dateTimeObj = {};
        let dateTimeStr = [];
        let ret = this.piker.getSelectedValue();
        for (let key in ret) {
            let tmp = ret[key];
            dateTimeStr.push(tmp.value);
            if (key == "picker-date") {
                dateTimeStr.push(" ");
            } else if (key == "picker-hours") {
                dateTimeStr.push(":");
            } else if (key == "picker-minutes") {
                dateTimeStr.push(":");
            }
            dateTimeObj[key] = tmp.name;
        }
        dateTimeStr.push("00");
        return {
            dateTimeObj: dateTimeObj,
            dateTimeStr: dateTimeStr.join("")
        };
    }
    /**
     * 重置默认选择日期时间
     * 
     * @param {string} selectValue 默认选择日期时间
     * 
     * @memberof OrderPicker
     */
    resetSelectValue(selectValue) {
        this.selectValue = selectValue;
    }
}
export default OrderPicker;