/**
 * Created by Administrator on 2016/5/4.
 * 这里是公共部分js
 */

var COMM = {
    /**
     * 数字格式化
     * @param s 数字、包含数字的字符串 如'aa1234.11'
     * @param n 小数点位数
     * @returns 带有千分符的字符串,如'1,234.11'
     */
    formatNumber : function (s, n) {
        n = n >= 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        r = (r == null ? "" : "." + r);
        t = "";
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        return t.split("").reverse().join("") + r;
    },
    digitClock : function(){
        $("#clock").MyDigitClock({
            fontFamily:"",
            fontColor: "#a8a7a9",
            timeFormat: '{FY}.{MON}.{DD}&nbsp;&nbsp;&nbsp;{HH}:{MM}:<small>{SS}</small>'
        });
    }
}

$(function(){
    COMM.digitClock();
})