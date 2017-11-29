import Template from 'utils/template.js';
import DateTime from 'utils/dateTime.js';
//模版引擎助手函数
/**
 * 数字千分位显示 例如15000执行函数后转换为15,000
 * 
 * @param {integer} num 要处理的数字
 * @returns {string} 返回处理好的数字
 */
Template.helper("numberFormat", function (num) {
    //如果传进来的值不是数字，则原值返回
    if (isNaN(num) || num < 1000) {
        return num;
    }
    let _num = num.toString(),
        result = '';
    while (_num.length > 3) {
        result = ',' + _num.slice(-3) + result;
        _num = _num.slice(0, _num.length - 3);
    }
    if (_num) {
        result = _num + result;
    }
    return result;
});
/**
 * 将数字四舍五入为指定小数位数的数字
 * 
 * @param {integer} num 要处理的数字
 * @param {integer} decimals 指定小数位数 
 * @returns {float||integer} 四舍五入后的数字
 */
Template.helper("toFixed", function (num, decimals) {
    let _num = num.toString();
    if (_num.indexOf(".") == -1) {
        _num = parseFloat(_num);
        return _num.toFixed(decimals);
    }
    return num;
});
/**
 * 格式化日期时间字符串
 * 
 * @param {string} dataTime 后端返回的日期时间 
 * @param {string} formate 格式化字符串,例如YYYY-MM-DD hh:ss:mm
 * @returns {string} 日期时间字符串
 */
Template.helper("formateDateTime", function (dataTime, formate) {
    let date = DateTime.getDateObj({
        dateTime: dataTime,
        dayCount: 0
    });
    return DateTime.formateDateTime(date, formate);
});
/**
 * 根据传入的class列表生成class字符串
 * 
 * @param {array} styleName class列表 
 * @returns {string} class字符串
 */
Template.helper("setClass", function (styleName) {
    return styleName.join(" ");
});