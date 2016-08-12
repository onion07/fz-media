/**
 * [主要脚本处理]
 * @version     0.0.2
 * @author      Chen jinSheng
 * @date        2016-03-29
 * @anotherdate 2016-03-29T14:34:58+0800
 * @return      COMMON                 [description]
 */
var APP = (function () {

    var COMMON = {};

    // var URL_top = 'json/rank_total.json'; //顶部信息
    // var URL_teams = 'json/rank_allTeams.json'; //六大团队
    // var URL_bar = 'json/rank_missionbar.json'; //柱状图（月度）
    // var URL_bar_quarter = 'json/rank_missionbarQuarter.json'; //柱状图（季度）
    // var URL_quarter = 'json/rank_doneQuarter.json'; //当季完成情况
    // var URL_month = 'json/rank_doneMonth.json'; //当月签约额
    // var URL_main = 'json/rank_main.json'; //合同数量,签约额汇总
    // var URL_news = 'json/news.json'; //底部新闻


    /***************         接口地址         ****************/

    // var Base = 'http://192.168.4.50/FSO.Net.Study/FSO/TelevisionService.svc/';
    var Base = 'http://192.168.4.50/FSO.Net/FSO/TelevisionService.svc/';
    var URL_top = Base + 'SouthUnicornTotal'; //顶部信息
    var URL_teams = Base + 'SouthUnicornTeam'; //六大团队
    var URL_bar = Base + 'SouthUnicornMissionByMonth'; //柱状图（月度）
    var URL_bar_quarter = Base + 'SouthUnicornMissionByQuarter'; //柱状图（季度）
    var URL_quarter = Base + 'SouthUnicornDoneByQuarter'; //当季完成情况
    var URL_month = Base + 'SouthUnicornDoneByMonth'; //当月签约额
    var URL_main = Base + 'SouthUnicornSignInfo'; //合同数量,签约额汇总
    var URL_news = Base + 'SouthMessage'; //底部新闻

     /***************        账号&密码         ****************/
     var uid = '5';
     var password = '715d048ca9c63ae12beba3d2a07a24cf';


    // 调用入口
    COMMON.init = function () {

        var _ts = this;
        // 6大团队
        _ts.inDex = 0;
        _ts.fla2 = 0;
        // 月度，季度
        _ts.index = 1;
        _ts.fla1 = 1;

        // 六大团队
        _ts.getAllTeams();
        _ts.getData(1);
        // 每隔一段时间重新加载数据
        _ts.getDataTime  && clearInterval(_ts.getDataTime);
        _ts.getDataTime = setInterval(_ts.getData.bind(_ts),1000 * 60 * 5);
        _ts.handleDOM.entrance();

    };
    // 请求函数
    COMMON.request = function (arg,callback) {
        if (typeof arg !== 'object' || Array.isArray(arg) || typeof callback !== 'function') { return false;}
        arg._type = typeof arg._type === 'undefined' ? 'GET' : arg._type; // 默认 请求方式为 'GET'
        arg._dataType = typeof arg._dataType === 'undefined' ? 'json' : arg._dataType; // 默认数据类型为'json' 
        arg._data = typeof arg._data === 'undefined' ? '' : arg._data; // 默认 data 为空
        $.ajax({
            url: arg._url,
            type: arg._type,
            dataType: arg._dataType,
            data: arg._data,
            dataFilter: function (ret) {
                var ret = typeof ret === 'string' && JSON.parse(ret);
                return ret;
            },
            success: function (ret) {
                if (typeof ret !== "undefined" && ret.code === 1) {
                    callback(ret);
                }
                else {
                    console.warn && console.warn('失败，返回的code !== 1');
                }
            },
            error: function () {
                console.warn && console.warn('网络错误！！请刷新');
            }
        });
    };
    // 请求数据
    COMMON.getData = function (o) {

        var _ts = this;
        // var tm_type = $('#bar-title .tile.active').data('type');
        _ts.clearSwipe();
        // 默认为 1 
        var o = _ts.o = typeof o === 'undefined' ? 1 : o;
        // 顶部信息
        _ts.request( { _url: URL_top,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.getTopMessage(ret); });
        // 柱状图
        _ts.request( { _url: URL_bar,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.loadBarData(ret); });
        // // 当季完成情况
        _ts.request( { _url: URL_quarter,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.hasDoneQuarter(ret); });
        // // 当月签约额
        _ts.request( { _url: URL_month,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.hasDoneMonth(ret); });
        // // 合同数量,签约额汇总
        _ts.request( { _url: URL_main,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.missionTotal(ret); });
        // // 底部 news
        _ts.request( { _url: URL_news,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.getNews(ret); });
        // if (is_first) {_ts.request( { _url: URL_news }, function (ret) { _ts.getNews(ret); });}
        
        // 计时和重新获取数据
        _ts.regetData(o);
    };
    // 每隔一段时间重新加载数据
    COMMON.regetData = function (o) {

        var _ts = this;
        var o = _ts.o = o;
        var invalCallbak = function () {
                if ( COMMON.o < 6 ) {
                    COMMON.o++;
                    _ts.inDex++ ;
                }
                else {
                    COMMON.o = 1;
                    _ts.inDex = 0;
                }
                // 重设、6大团队
                _ts.setTeams(_ts.inDex); 
                // 重设、默认项“月度”
                _ts.setIssue(1); 
                // 重新请求数据
                COMMON.getData(_ts.o);
        };

         _ts.rlTime  && clearInterval(_ts.rlTime);
         _ts.rlTime = setInterval(invalCallbak,1000 * 30); // 30秒更换数据
    };
    // 重设tab 团队 
    COMMON.setTeams = function (index) {
        var _ts = this;
        var targetEle2 = $('#all-team .list');

        _ts.inDex = index;
        _ts.fla2 = index;
        targetEle2.removeClass('cur').eq(_ts.inDex).addClass('cur');

        // return flag;
    };
    // 重设tab “月度”，“季度” 
    COMMON.setIssue = function (index) {
        var _ts = this;
        var targetEle1 = $('#bar-title .tile');

        _ts.index = index;
        _ts.fla1 = index;
        targetEle1.removeClass('active').eq(_ts.index).addClass('active');

        // return flag;
    };
    // DOM 事件
    COMMON.handleDOM = {
        entrance: function () {
            var _that = this;
            _that.barTitleTab();
            _that.allTeamTab();
        },
        //事件： 团队 切换
        allTeamTab: function () {
            var _ts = COMMON;
            var targetEle2 = $('#all-team');
            
            targetEle2.on('click','.list',function (e) {

                    var tm_type = $(this).data('team');
                    var num = $(this).data('num')+1;

                    _ts.clearSwipe(); // 清除swipe自动播放
                    _ts.inDex = $(this).index();
                    if (_ts.inDex === _ts.fla2) { return false;}
                    COMMON.o = num;

                    // 重设 tab
                    _ts.setTeams(_ts.inDex);
                    _ts.setIssue(1);
                    _ts.getData(_ts.o);
            });
        },
        //事件： 季度，月度 切换
        barTitleTab: function () {
            var _ts = COMMON;
            var targetEle1 = $('#bar-title .tile');

            targetEle1.click(function () {
                    // var $cur_li = $('#all-team').find('li.cur');

                    var o = _ts.o ;
                    var url = '';
                    
                    _ts.index = $(this).index();
                    if (_ts.index === _ts.fla1) { return false;}

                    _ts.setIssue(_ts.index);

                    _ts.index === 1 ? url = URL_bar : url = URL_bar_quarter;
                    // 柱状图
                    _ts.request( { _url: url,_data: {userId:uid,password:password,unicornNo:o} }, function (ret) { _ts.loadBarData(ret); });
            });
        }
        
    };
    // 顶部信息
    COMMON.getTopMessage = function (ret) {

        var _ts = this; 
        var ret = ret;
        var _html = '';
        var year_f = COMM.formatNumber(ret.data.year_finish,0);
        var year_m = COMM.formatNumber(ret.data.year_mission,0);

        ret.data.year_finish = year_f;
        ret.data.year_mission = year_m;
        _html =  template('tMsg',ret);

        document.getElementById('top-msg').innerHTML = _html;

    };
    // 六大独角兽
    COMMON.getAllTeams = function () {
        var _ts = this; 
        var ret = ret;
        var _html = '';

        _ts.request( { _url: URL_teams,_data: {userId:uid,password:password} }, function (ret) {

            if (ret.data.length < 1) {
                window.console && window.console.warn('请求的数据ret.data 为空数组！');
                return false;
            }
            _html = template('allTeamsMsg',ret);
            document.getElementById('all-team').innerHTML = _html;
        });

    };
    /*计算图表interval值*/
    COMMON.sortNumber = function (a,b){
            return b - a ;
    };
    // 辅助线处理
    COMMON.getIntvalMax = function (arr1,arr2){
            var concatArr = arr1.concat(arr2),
                maxInArr = concatArr.sort(this.sortNumber)[0];

            if(maxInArr < 1){
                maxInArr = 7;
            }

            var intval = Math.ceil(maxInArr / 7),
                intval2 = intval,
                numLen = intval.toString().length;
            intval = Math.ceil(Number(intval) / Math.pow(10,(numLen-1)));

            var acture = Number(intval2) / Math.pow(10,(numLen-1));

            if((intval - 0.5) >= acture){
                intval = (intval - 0.5) * Math.pow(10,(numLen-1));
            }else{
                intval = intval * Math.pow(10,(numLen-1));
            }
            return intval;
    };
    // 图表入口
    COMMON.loadBarData = function (ret) {

        var _ts = this;
        _ts.initEchar(ret);
    };
    // 初始化图表
    COMMON.initEchar = function (ret) {

        var _ts = this;
        var ret = ret;
        // 图表 对应 DOM元素
        _ts.chart = echarts.init(document.getElementById('echar-box'));
        // 图表初始参数
        var option = {
            color: ['#f3b24b','#33344b','#ed6f3e'],
            title: {
                text: '单位：万元',
                // top:20,
                textStyle: {
                    color:'#b4b3b3',
                    fontSize: 16
                }
            },
            tooltip: {
                show: true,
                trigger: 'axis',
                axisPointer: {
                    type: 'line'
                    // type: 'shadow'
                }
            },
            legend: {
                bottom: 20,
                align: 'left',
                itemWidth: 10,
                itemHeight: 10,
                data:[
                    {
                        name:'发布额',
                        textStyle:{
                            color:'#f3b24b'
                        }
                    },
                    {
                        name:'全年任务',
                        textStyle:{
                            color:'#a5a5bd'
                        }
                    },
                    {
                        name:'全年完成率',
                        textStyle:{
                            color:'#ec6e3b'
                        }
                    }
                ]
            },
            grid: {
                show: false,
                left: 70,
                right: 70,
                top: 60,
                bottom: 90
            },
            xAxis: [
                {
                    type: 'category',
                    axisLine:{show:false},
                    axisTick: {show: false},
                    axisLabel:{
                        textStyle:{
                            color: '#b4b3b3',
                            fontSize: 16
                        }
                    },
                    splitLine: {show: false},
                    data: []
                },
                {
                    type: 'category',
                    axisLine:{show:false},
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLabel: {show:false},
                    splitArea: {show:false},
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#b4b3b3',
                            fontSize: 14
                        },
                        formatter: '{value}.00'
                    },
                    axisLine:{
                        show:false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#3c3537'
                        }
                    },
                    // min: 0,
                    // max: 1400,
                    // interval: 200
                },
                {
                    type: 'value',
                    axisLabel: {
                        textStyle: {
                            color: '#b4b3b3',
                            fontSize: 14
                        },
                        formatter: '{value}.00%'
                    },
                    axisLine:{
                        show:false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#3c3537'
                        }
                    },
                    // min: 0,
                    // max: 140,
                    // interval: 20
                }
            ],
            series: [
                {
                    name: '发布额',
                    type: 'bar',
                    xAxisIndex:0,
                    yAxisIndex: 0,
                    z:3,
                    barMaxWidth: 50,
                    barCategoryGap : '60%',
                    markPoint:{
                        symbol:'image://img/markpoint2.png',
                        symbolSize: [110,36],
                        symbolOffset : [82,0],
                        itemStyle: {
                            normal: {
                                label: {
                                    // show: false,
                                    textStyle: {
                                        fontSize: 16
                                    },
                                    formatter: '{c0}'
                                }
                            }
                        },
                        data: []
                    },
                    data: []
                },
                {
                    name: '全年任务',
                    type: 'bar',
                    xAxisIndex:1,
                    yAxisIndex: 0,
                    z:2,
                    barMaxWidth: 50,
                    barCategoryGap : '60%',
                    data: []
                },
                {
                    name: '全年完成率',
                    type: 'line',
                    xAxisIndex: 0,
                    yAxisIndex: 1,
                    z:4,
                    symbol: 'circle',
                    //symbol: 'image://img/symbol.png',
                    symbolSize: 8,
                    markPoint:{
                        // symbol:'pin',
                        symbol:'image://img/markpoint.png',
                        symbolSize: [120,40],
                        symbolOffset : [0,30],
                        itemStyle: {
                            normal: {
                                label: {
                                    // show: false,
                                    textStyle: {
                                        fontWeight: 'bold',
                                        fontSize: 20
                                    },
                                    formatter: '{c0}%'
                                }
                            }
                        },
                        data:[]
                        // data: [
                        //     {
                        //         type: "max",
                        //         label:{
                        //             show:false
                        //         },
                        //         textStyle:{
                        //             fontWeight:'bold'
                        //         }
                        //     }
                        // ]
                    },
                    itemStyle:{
                        normal:{
                            label:{
                                show: true,
                                textStyle:{
                                    color: '#fff',
                                    fontSize: 16
                                },
                                formatter: '{c0}%'
                            }
                        }
                    },
                    data: []
                }
            ]
        };

        // 渲染预处理
         _ts.randerEchar(ret,option);

    };
    // 渲染预处理
    COMMON.randerEchar = function (ret,opt) {
        
        var _ts = this;
        var ret = ret;

        /*分割线间距设置*/
        var setIntval_1 = _ts.getIntvalMax(ret.series[0].issue_data,ret.series[0].mission_data),
            setMax_1 = setIntval_1 * 7,
            setIntval_2 = _ts.getIntvalMax(ret.series[0].rate_data,[0]),
            setMax_2 = setIntval_2 * 7;


        // x轴
        opt.xAxis[0].data = opt.xAxis[1].data = ret.xdata;
        // y轴
        opt.yAxis[0].min  = 0;
        opt.yAxis[0].max  = setMax_1;
        opt.yAxis[0].interval  = setIntval_1;
        opt.yAxis[1].min = 0;
        opt.yAxis[1].max = setMax_2;
        opt.yAxis[1].interval = setIntval_2;
        // 发布额
        var valueArr = ret.series[0].issue_data;
        var isuee = [];
        var len = valueArr.length;
        // 设置 markPoint
        if (len <= 6) {
            for (var i = 0; i < len; i++) {

                    // push进 markPoint.data 数组
                    isuee.push({
                            value: valueArr[i],
                            xAxis: i,
                            yAxis: Math.abs( valueArr[i] / 2 ),
                            label:{
                                show:false
                            }
                    });
            }
        }

        opt.series[0].markPoint.data = isuee;
        opt.series[0].data = valueArr;

        // 全年任务
        opt.series[1].data = ret.series[0].mission_data;
        // 全年完成率
        var cacheArr = ret.series[0].rate_data;
        var mpo = [];
        var colorArr = [];
        var len = cacheArr.length;
        // 设置 markPoint
        for (var i = 0; i < len; i++) {
            if (cacheArr[i] >= 100) {

                // 隐藏对应 label
                cacheArr.splice(i,1,{
                        value: cacheArr[i],
                        itemStyle:{ normal:{ label:{show: false} } }
                });
                // push进 markPoint.data 数组
                mpo.push({
                        value: cacheArr[i].value,
                        xAxis: i,
                        yAxis: cacheArr[i].value,
                        label:{
                            show:false
                        },
                        textStyle:{
                            fontWeight:'bold'
                        }
                });

                colorArr.push(cacheArr[i]);
            }
            else {
                if (cacheArr[i] === 0 ) {
                    colorArr.push({
                        value: cacheArr[i],
                        itemStyle:{
                            normal:{
                                label:{
                                    textStyle:{
                                        // 黄色
                                        color: '#e49819'
                                    }
                                }
                            }
                        }
                    });
                }
                else {
                    if ( 50 >= cacheArr[i] > 0 ) {
                        colorArr.push({
                            value: cacheArr[i],
                            itemStyle:{
                                normal:{
                                    label:{
                                        textStyle:{
                                            // 绿色
                                            color: '#68a708'
                                        }
                                    }
                                }
                            }
                        });
                    }
                    else {
                        colorArr.push(cacheArr[i]);
                    }
                }
            }

        }
        // console.info(colorArr)
        // 重设置opt
        opt.series[2].markPoint.data = mpo;
        opt.series[2].data = colorArr;



        // 写入、渲染echart
        _ts.chart.setOption(opt);

    };
    // 三个框数据：公共函数
    COMMON.getDataComMONon = function (message) {

            var _ts = this;
            var htm = '',str = '',tab_len = 0;
            var Msg = message;
            
            var Data = Msg.Data;
            var j_len = Msg.j_len;
            var maxTime = Msg.maxTime; //30s滚完所有数据
            var swipeName = Msg.swipeName;
            var contentWidth = Msg.contentWidth;
            var table = Msg.table;
            var idSelector = Msg.idSelector;
            var swSelectio = Msg.swSelectio;
            var secondlevel = Msg.secondlevel;

            if(j_len > 0){
                $.each(Data,function(idx,val){
                    var target = Data[idx][secondlevel[3]].split('%')[0];
                    var exceed = val.rate !== 0 && ( target >= 100 ? true : false );
                    var exceed2 = val.rate !== 0 && ( 50 >= target > 0 ? true : false );
                    var exceed3 = target == 0 ? true : false ;
                    // console.info(target,exceed3)
                    if (exceed) {                            
                        str += '<tr class="fc-red">';
                    }
                    else {
                        if (exceed2 && !exceed3) {
                            str += '<tr class="fc-green">';
                        }
                        else {
                             if (exceed3) {
                                 str += '<tr class="fc-yellow">';
                             }
                             else {
                                str += '<tr>';
                             }
                        }
                    }
                        str +=  '<td>'+Data[idx][secondlevel[0]]+'</td>'
                        str +=  '<td>'+COMM.formatNumber( Data[idx][secondlevel[1]],0 )+'</td>'
                        str +=  '<td>'+COMM.formatNumber( Data[idx][secondlevel[2]],0 )+'</td>'
                        str +=  '<td>'+Data[idx][secondlevel[3]]+'</td>'
                        str +=  '</tr>';

                    if(((idx+1)%5 === 0 && idx !== 0) || (idx+1) === j_len){
                        tab_len++;
                        htm += '<table class="tab-list swiper-slide">'+
                                    '<tbody class="">'+str+'</tbody>' +
                               '</table>';
                        str = '';
                    }
                });
                idSelector.css({'width':(100*tab_len)+'%'});
                idSelector.find('.tab-list').css({'width':(100/tab_len)+'%'});
                idSelector.html(htm);
                table.width(contentWidth);

            }   

        return tab_len;

    };
    // 当季完成情况 
    COMMON.hasDoneQuarter = function (ret) {

        var _ts = this; 
        var ret = ret;
        var message = {
            Data: ret.data,
            j_len: ret.data.length,
            maxTime: 30000,
            swipeName: 'qutSwiper',
            contentWidth: $('.tab-content').width(),
            table: $('.tab-list'),
            idSelector: $('#fbox1'),
            swSelectio: '.swip1',
            secondlevel: ["group","total_finish","total_mission","rate"] //接口,data数组下
        };

        // 获取 返回的页数
        var tab_len = _ts.getDataComMONon(message);

        _ts.swipeName1 = new Swiper(message.swSelectio,{
                                autoplay: (message.maxTime - 1000)/tab_len, // 29秒滚完，预留1秒
                                loop: true,
                                autoplayDisableOnInteraction: false
                            });

        if(message.j_len <= 5){
            _ts.swipeName1.stopAutoplay();
        }
    };
    // 当月签约额
    COMMON.hasDoneMonth = function (ret) {

        var _ts = this; 
        var ret = ret;
        var message = {
            Data: ret.data,
            j_len: ret.data.length,
            maxTime: 30000,
            swipeName: 'mthSwiper',
            contentWidth: $('.tab-content').width(),
            table: $('.tab-list'),
            idSelector: $('#fbox2'),
            swSelectio: '.swip2',
            secondlevel: ["group","total_finish_month","total_mission_month","rate"] //接口,data数组下
        };

        // 返回页数
        var tab_len = _ts.getDataComMONon(message);

        _ts.swipeName2 = new Swiper(message.swSelectio,{
                                autoplay: (message.maxTime - 1000)/tab_len, // 29秒滚完，预留1秒
                                loop: true,
                                autoplayDisableOnInteraction: false
                        });

        if(message.j_len <= 5){
            _ts.swipeName2.stopAutoplay();
        }
    
    };
     // 合同数量,签约额汇总
    COMMON.missionTotal = function (ret) {
        
        var _ts = this; 
        var ret = ret;
        var numData = ret.number;
        var signData = ret.total;
        var _html1 = '';
        var _html2 = '';

        // 签约额汇总 - 数字格式化
        var year_t = COMM.formatNumber(signData.year_total,0);
        var quarter_t = COMM.formatNumber(signData.quarter_total,0);
        var month_t = COMM.formatNumber(signData.month_total,0);
        signData.year_total = year_t;
        signData.quarter_total = quarter_t;
        signData.month_total = month_t;


        // 合同数量
        _html1 =  template('numberMsg',numData);
        // 签约额汇总
        _html2=  template('signMsg',signData);

        document.getElementById('numList').innerHTML = _html1;
        document.getElementById('totalList').innerHTML = _html2;

    };
    // 清除swipe的自动播放
    COMMON.clearSwipe = function () {
        var _ts = this;
        _ts.swipeName1 && _ts.swipeName1.stopAutoplay();
        _ts.swipeName2 && _ts.swipeName2.stopAutoplay();
    };
    // 底部信息
    COMMON.getNews = function (ret) { 

        var _ts = this; 
        var ret = ret;
        var _html = '';

        if (ret.data.length < 1) {
            window.console && window.console.warn('请求的数据ret.data 为空数组！');
            return false;
        }
        _html = template('newsMsg',ret);
        document.getElementById('news').innerHTML = _html;
    };




    return COMMON;
})();




/****  入口  ****/
$(function () {
    APP.init();
});