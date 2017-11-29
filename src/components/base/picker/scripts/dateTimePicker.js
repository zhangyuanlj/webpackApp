import Zepto from 'jQuery';
import Component from 'components/base/component.js';
import DateTime from 'utils/dateTime.js';
import Helper from 'utils/helper.js';
import Pannel from 'components/base/pannel/scripts/pannel.js';
import Picker from './picker.js';
import {
    TimePicker
} from '../install';
class DateTimePicker extends Component {
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
            },
            type: "timePicker",
            selectRange: {
                start: "2010",
                end: "2050"
            }
        };
        this.setOptions(options);
    }
    render() {
        this.initPannel();
        if (this.defaults.type === "datePicker") {
            this.renderDatePicker();
        } else if (this.defaults.type === "dateTimePicker") {
            this.renderDateTimePicker();
        } else if (this.defaults.type === "timePicker") {
            this.renderTimePicker();
        }
    }
    renderDateTimePicker() {
        let self = this;
        let items = [];
        let timeList = this.createTimeList();
        if (this.defaults.selectRange.start.indexOf("-") == -1) {
            let dateList = this.createDetailDateList();
            items = [{
                name: "year",
                list: dateList.yearList
            }, {
                name: "month",
                list: dateList.monthList,
                scrollEndCallback: (itemId) => {
                    this.updateDayList(itemId);
                }
            }, {
                name: "day",
                list: dateList.dayList
            }, {
                name: "hour",
                list: timeList.hourList
            }, {
                name: "minute",
                list: timeList.minuteList
            }, {
                name: "second",
                list: timeList.secondList
            }];
        } else {
            let dateList = this.createSimpleDateList();
            items = [{
                name: "date",
                list: dateList.dateList
            }, {
                name: "hour",
                list: timeList.hourList
            }, {
                name: "minute",
                list: timeList.minuteList
            }, {
                name: "second",
                list: timeList.secondList
            }];
        }
        this.picker = new Picker({
            $display: self.pannel.getScrollView(),
            itemHeight: 100,
            items: items
        });
    }
    renderDatePicker() {
        let self = this;
        let items = [];
        let dateList = this.createDetailDateList();
        this.picker = new Picker({
            $display: self.pannel.getScrollView(),
            itemHeight: 100,
            items: [{
                name: "year",
                list: dateList.yearList
            }, {
                name: "month",
                list: dateList.monthList,
                scrollEndCallback: (itemId) => {
                    this.updateDayList(itemId);
                }
            }, {
                name: "day",
                list: dateList.dayList
            }]
        });
    }
    renderTimePicker() {
        let self = this;
        let timeList = this.createTimeList();
        this.picker = new Picker({
            $display: self.pannel.getScrollView(),
            itemHeight: 100,
            items: [{
                name: "hour",
                list: timeList.hourList
            }, {
                name: "minute",
                list: timeList.minuteList
            }, {
                name: "second",
                list: timeList.secondList
            }]
        });
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
    getCurrentDateTime() {
        let dateTime = DateTime.getDateObj();
        dateTime = DateTime.getDateInfo(dateTime);
        return dateTime;
    }
    getSelectRangeInfo() {
        let selectRange = this.defaults.selectRange;
        let start = selectRange.start.split("-");
        let end = selectRange.end.split("-");
        return {
            start: {
                year: start[0],
                month: start[1],
                day: start[2]
            },
            end: {
                year: end[0],
                month: end[1],
                day: end[2]
            }
        };
    }
    getDateScope() {
        let selectRange = this.defaults.selectRange;
        let start = selectRange.start;
        let end = selectRange.end;
        let ret = DateTime.getDateScope(start, end);
        return ret;
    }
    createSimpleDateList() {
        let dateTime = this.defaults.selectValue,
            date,
            selectedTime;
        if (dateTime !== null) {
            dateTime = dateTime.split(" ");
            date = dateTime[0];
            selectedTime = dateTime[1];
        } else {
            dateTime = this.getCurrentDateTime();
            date = `${dateTime.year}-${dateTime.month}-${dateTime.day}`;
        }
        let timeList = this.createTimeList(selectedTime);
        let dateList = [],
            hourList = timeList.hourList,
            minuteList = timeList.minuteList,
            secondList = timeList.secondList;
        let dateScope = this.getDateScope();
        let dateScopeLen = dateScope.length;
        for (let i = 0; i < dateScopeLen; i++) {
            let str = dateScope[i].str;
            let item = {
                name: str,
                value: str
            };
            if (str === date) {
                item.selected = true;
            }
            dateList.push(item);
        }
        return {
            dateList: dateList,
            hourList: hourList,
            minuteList: minuteList,
            secondList: secondList
        };
    }
    createDetailDateList() {
        let dateTime = this.defaults.selectValue;
        if (dateTime !== null) {
            dateTime = dateTime.split("-");
            dateTime = {
                year: dateTime[0],
                month: dateTime[1],
                day: dateTime[2]
            };
        } else {
            dateTime = this.getCurrentDateTime();
        }
        let yearList = [];
        let monthList = [];
        let dayList = [];
        let selectRange = this.getSelectRangeInfo();
        let start = selectRange.start;
        let end = selectRange.end;
        let monthDays = this.getMonthDays(dateTime.year, dateTime.month);
        for (let i = start.year; i <= end.year; i++) {
            let item = {
                name: i,
                value: i
            };
            if (dateTime.year.toString() === i.toString()) {
                item.selected = true;
            }
            yearList.push(item);
        }
        for (let j = 1; j <= 12; j++) {
            let month = Helper.prefixInteger(j, 2);
            let item = {
                name: month,
                value: month
            };
            if (dateTime.month.toString() === month) {
                item.selected = true;
            }
            monthList.push(item);
        }
        for (let k = 1; k <= monthDays; k++) {
            let day = Helper.prefixInteger(k, 2);
            let item = {
                name: day,
                value: day
            };
            if (dateTime.day.toString() === day) {
                item.selected = true;
            }
            dayList.push(item);
        }
        return {
            yearList: yearList,
            monthList: monthList,
            dayList: dayList
        };
    }
    /**
     * 根据年份和月份获取选择月份的天数
     * 
     * @param {string} itemId item的id
     * @returns 
     * @memberof DateTimePicker
     */
    updateDayList(itemId) {
        let dayList = [];
        let selectedValue = this.picker.getSelectedValue();
        let year = selectedValue["picker-year"].value;
        let month = selectedValue[itemId].value;
        let lastSelectedValue = selectedValue["picker-day"].value;
        let monthDays = this.getMonthDays(year, month);
        for (let i = 1; i <= monthDays; i++) {
            let day = Helper.prefixInteger(i, 2);
            let item = {
                name: day,
                value: day
            };
            dayList.push(item);
        }
        this.picker.updateItem("picker-day", dayList, lastSelectedValue);
    }
    /**
     * 检查当前年份是否为闰年
     * 
     * @param {integer} year 年份 
     * @returns 
     * @memberof DateTimePicker
     */
    isLeapYear(year) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * 获取指定月的天数
     * 
     * @param {integer} year 年份
     * @param {integer} month 月份
     * @returns 
     * @memberof DateTimePicker
     */
    getMonthDays(year, month) {
        var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.isLeapYear(year)) {
            monthDays[1] = 29;
        }
        return monthDays[month - 1];
    }
    createTimeList(selectValue) {
        let dateTime = selectValue ? selectValue : this.defaults.selectValue;
        if (dateTime !== null) {
            dateTime = dateTime.split(":");
            dateTime = {
                hours: dateTime[0],
                minute: dateTime[1],
                second: dateTime[2]
            };
        } else {
            dateTime = this.getCurrentDateTime();
        }
        let hourList = [];
        let minuteList = [];
        let secondList = [];
        for (let i = 0; i < 24; i++) {
            let hour = Helper.prefixInteger(i, 2);
            let item = {
                name: hour,
                value: hour
            };
            if (dateTime.hours.toString() === hour) {
                item.selected = true;
            }
            hourList.push(item);
        }
        for (let j = 0; j < 60; j++) {
            let ret = Helper.prefixInteger(j, 2);
            let minuteItem = {
                name: ret,
                value: ret
            };
            let secondItem = {
                name: ret,
                value: ret
            };
            if (dateTime.minute.toString() === ret) {
                minuteItem.selected = true;
            }
            if (dateTime.second.toString() === ret) {
                secondItem.selected = true;
            }
            minuteList.push(minuteItem);
            secondList.push(secondItem);
        }
        return {
            hourList: hourList,
            minuteList: minuteList,
            secondList: secondList
        };
    }
    getSelectedValue() {
        let ret = {};
        let selectedValue = this.picker.getSelectedValue();
        if (this.defaults.type === "datePicker") {
            ret["year"] = selectedValue["picker-year"].value;
            ret["month"] = selectedValue["picker-month"].value;
            ret["day"] = selectedValue["picker-day"].value;
            ret["str"] = `${ret["year"]}-${ret["month"]}-${ret["day"]}`;

        } else if (this.defaults.type === "dateTimePicker") {
            ret["hour"] = selectedValue["picker-hour"].value;
            ret["minute"] = selectedValue["picker-minute"].value;
            ret["second"] = selectedValue["picker-second"].value;
            if (this.defaults.selectRange.start.indexOf("-") == -1) {
                ret["year"] = selectedValue["picker-year"].value;
                ret["month"] = selectedValue["picker-month"].value;
                ret["day"] = selectedValue["picker-day"].value;
                ret["str"] = `${ret["year"]}-${ret["month"]}-${ret["day"]} ${ret["hour"]}:${ret["minute"]}:${ret["second"]}`;
            } else {
                ret["date"] = selectedValue["picker-date"].value;
                ret["str"] = `${ret["date"]} ${ret["hour"]}:${ret["minute"]}:${ret["second"]}`;
            }
        } else if (this.defaults.type === "timePicker") {
            ret["hour"] = selectedValue["picker-hour"].value;
            ret["minute"] = selectedValue["picker-minute"].value;
            ret["second"] = selectedValue["picker-second"].value;
            ret["str"] = `${ret["hour"]}:${ret["minute"]}:${ret["second"]}`;
        }
        return ret;
    }
}
export default DateTimePicker;