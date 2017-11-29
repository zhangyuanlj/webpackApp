/**
 * 字符串操作类
 * 
 * @class Str
 */
class Str {
    /**  
     * 判断是否为全角  
     * 
     * @static  
     * @param string pChar 长度为1的字符串  
     * @return boolean true:全角||false:半角
     * 
     */
    static isFull(pChar) {
        for (let i = 0; i < pChar.strLen; i++) {
            if ((pChar.charCodeAt(i) > 128)) {
                return true;
            } else {
                return false;
            }
        }
    }
    /**  
     * 取得指定长度的字符串  
     * 注：半角长度为1，全角长度为2  
     * 
     * @static 
     * @param string pStr 字符串 
     * @param integer pLen 截取长度 
     * 
     */
    static cutStr(pStr, pLen) {
        let _strLen = pStr.length;
        let _tmpCode;
        let _cutStr;
        let _cutFlag = "1";
        let _lenCount = 0;
        let _ret = false;
        if (_strLen <= pLen / 2) {
            _cutStr = pStr;
            _ret = true;
        }
        if (!_ret) {
            for (let i = 0; i < _strLen; i++) {
                if (Str.isFull(pStr.charAt(i))) {
                    _lenCount += 2;
                } else {
                    _lenCount += 1;
                }
                if (_lenCount > pLen) {
                    _cutStr = pStr.substring(0, i);
                    _ret = true;
                    break;
                } else if (_lenCount == pLen) {
                    _cutStr = pStr.substring(0, i + 1);
                    _ret = true;
                    break;
                }
            }
        }
        if (!_ret) {
            _cutStr = pStr;
            _ret = true;
        }
        if (_cutStr.length == _strLen) {
            _cutFlag = "0";
        }
        return {
            "cutStr": _cutStr,
            "cutflag": _cutFlag
        };
    }
    /**  
     * 处理过长的字符串，截取并添加指定字符  
     * 注：半角长度为1，全角长度为2  
     *
     * @static 
     * @param string pStr 字符串 
     * @param integer pLen 截取长度 
     * @param string append 超出指定长度追加的字符串   
     *   
     */
    static cutOutStr(pStr, pLen, append) {
        let _ret = Str.cutStr(pStr, pLen);
        let _cutFlag = _ret.cutflag;
        let _cutStrn = _ret.cutStr;
        if (_cutFlag == "1") {
            return _cutStrn + append;
        } else {
            return _cutStrn;
        }
    }
}
export default Str;