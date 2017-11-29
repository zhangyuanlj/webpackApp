import SYS_CONFIG from 'config';
import Zepto from 'jQuery';
import Rsa from 'utils/rsa.js';
const AUTH_URL = SYS_CONFIG.AUTH_URL;
let RsaEncode = function (arryToEncode, onSuccess, onError) {
    $.ajax({
        dataType: "jsonp",
        url: AUTH_URL + "encryption/getPublicKey.html",
        success: function (res) {
            var rsa = new Rsa();
            var data = res.data;
            if (data) {
                rsa.setPublicByBase64(data.modulus, data.exponent);
                for (var i = 0; i < arryToEncode.length; i++) {
                    arryToEncode[i] = rsa.encryptToBase64(arryToEncode[i], data.keysize);
                }
                onSuccess && onSuccess(arryToEncode);
            } else {
                onError && onError({
                    code: -1002,
                    message: res.message
                });
            }
        },
        error: function () {
            onError && onError({
                code: -1001,
                message: "网络错误，加密失败"
            });
        }
    });
}
export default RsaEncode;