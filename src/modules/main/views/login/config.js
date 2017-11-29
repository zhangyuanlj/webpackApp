//模块配置文件
const CONFIG = {
    HEADER: {
        left: [{
            icon: ["ion-ios-arrow-left"],
            name: "goback",
            text: "返回"
        }],
        title: "登录页",
        callback: {
            goback: function(){
                alert(3);
            }
        }
    }
};
export default CONFIG;