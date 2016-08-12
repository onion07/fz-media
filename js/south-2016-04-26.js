/**
 * Created by Administrator on 2016/3/25.
 * author duhuiling
 */

$(function(){
    $("#clock").MyDigitClock({
        fontFamily:"",
        fontColor: "#a8a7a9",
        timeFormat: '{FY}.{MON}.{DD}&nbsp;&nbsp;&nbsp;{HH}:{MM}:<small>{SS}</small>'
    });

    var myChart = echarts.init(document.getElementById('main'));

    var option = {
        color: ['#f3b24b','#33344b','#ed6f3e'],
        title: {
            text: '单位：万元',
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
            }
        },
        legend: {
            bottom: 0,
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
            left: 75,
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
                data: ["","","","","",""]
            },
            {
                type: 'category',
                axisLine:{show:false},
                axisTick: {show: false},
                splitLine: {show: false},
                axisLabel: {show:false},
                splitArea: {show:false},
                data: ["","","","","",""]
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
                min: 0,
                max: 1400,
                interval: 200
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
                min: 0,
                max: 105,
                interval: 15
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
                data: [0, 0, 0, 0, 0, 0]
            },
            {
                name: '全年任务',
                type: 'bar',
                xAxisIndex:1,
                yAxisIndex: 0,
                z:2,
                barMaxWidth: 50,
                /*label:{
                    normal:{
                        show: true,
                        textStyle:{
                            color: '#fff',
                            fontSize: 16
                        },
                        position: 'top',
                         formatter: function(parm){
                             console.log(parm)
                         }
                    }
                },*/
                data: [0, 0, 0, 0, 0, 0]
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
                    //symbol:'pin',
                    symbol:'image://img/markpoint.png',
                    symbolSize: [110,40],
                    symbolOffset : [0,30],
                    itemStyle: {
                        normal: {
                            label: {
                                textStyle: {
                                    fontWeight: 'bold',
                                    fontSize: 20
                                },
                                formatter: '{c0}%'
                            }
                        }
                    },
                    data: [
                        /*{
                            //type: "max",
                             value: 102.46, xAxis: 0, yAxis: 102.46,
                            label:{
                                show:false
                            },
                            textStyle:{
                                fontWeight:'bold'
                            }
                        }*/
                    ]
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
                data: [{
                    value: 0,
                    itemStyle:{
                        normal:{
                            label:{
                                show: false
                            }
                        }
                    }
                }, 0, 0, 0, 0, 0]
            }
        ]
    };

    myChart.setOption(option);

    var uid = '5',
        password = '715d048ca9c63ae12beba3d2a07a24cf',
        baseUrl = 'http://192.168.4.50/FSO.Net.Study/FSO/TelevisionService.svc/';

    var data_url = {
        //south_main : 'json/south_main.json',
        //south_echart : 'json/south_echart_year.json',
        //south_team_rank : 'json/south_team_rank.json',
        //south_group_rank : 'json/south_group_rank.json',
        //south_personal_rank : 'json/south_personal_rank.json',
        //group_rate : 'json/group_rate.json',
        //personal_rate : 'json/personal_rate.json',
        //group_finish : 'json/group_finish.json',
        //news : 'json/news.json'

        south_main : baseUrl + 'SouthSignInformation',
        south_echart : baseUrl + 'SouthTeamRate',
        south_team_rank : baseUrl + 'SouthTeamRank',
        south_group_rank : baseUrl + 'SouthGroupRank',
        south_personal_rank : baseUrl + 'SouthPersonalRank',
        group_rate : baseUrl + 'SouthGroupRate',
        personal_rate : baseUrl + 'SouthPersonalRate',
        group_finish : baseUrl + 'SouthGroupSignInfo',
        news : baseUrl + 'SouthMessage'
    };
    var func = {
        interval : null,
        Request : function (arg,callback) {
            if (typeof arg === 'undefined' || typeof callback === 'undefined') { return; }
            arg._type = typeof arg._type === 'undefined' ? 'GET' : arg._type; // 默认 请求方式为 'GET'
            arg._dataType = typeof arg._dataType === 'undefined' ? 'json' : arg._dataType; // 默认数据类型为'json'
            arg._data = typeof arg._data === 'undefined' ? '' : arg._data; // 默认 data 为空

            $.ajax({
                url: arg._url,
                type: arg._type,
                dataType: arg._dataType,
                data: arg._data,
                success: function (ret) {
                    var ret = JSON.parse(ret);
                    //console.log(ret)
                    if (typeof ret !== "undefined" && ret.code === 1) {
                        callback(ret);
                    }else{
                        console.warn && console.warn(arg._url+" : "+ret.massage);
                    }
                },
                error: function () {
                    console.warn && console.warn(arg._url+" : in ERROR!");
                }
            });
        },
        setMaindata : function(json){
            var _self = this;
            $('#year_mission').html(_self.formatNumber(json.data.year_mission,0));
            $('#year_over').html(_self.formatNumber(json.data.year_finish,0));
            if(json.data.year_mission > 0){
                var rate = (json.data.year_finish / json.data.year_mission * 100).toFixed(2);
                $('#over_rate').html(rate+'%');
            }else{
                $('#over_rate').html('0%');
            }

            $('#day_num').html(json.data.day_contract);
            $('#week_num').html(json.data.week_contract);
            $('#month_num').html(json.data.month_contract);
            $('#day_total').html(_self.formatNumber(json.data.day_total,0));
            $('#week_total').html(_self.formatNumber(json.data.week_total,0));
            $('#month_total').html(_self.formatNumber(json.data.month_total,0));
        },
        setCharts : function(json){
            if(json.xdata.length > 0){
                var _self = this;
                /*设置markPoint*/
                var data_res = [], mark_res = [], len = json.series[0].rate_data.length;
                for(var i = 0;i < len;i++){
                    if(json.series[0].rate_data[i] >= 100){
                        data_res.push({
                            value: json.series[0].rate_data[i],
                            itemStyle:{
                                normal:{
                                    label:{
                                        show: false
                                    }
                                },
                                emphasis: {
                                    label:{
                                        show: false
                                    }
                                }
                            }
                        });
                        mark_res.push({
                            value: json.series[0].rate_data[i],
                            xAxis: i,
                            yAxis: json.series[0].rate_data[i],
                            label:{
                                show:false
                            },
                            textStyle:{
                                fontWeight:'bold'
                            }
                        });
                    }else{
                        data_res.push(json.series[0].rate_data[i]);
                    }
                }

                /*分割线间距设置*/
                var setIntval_1 = _self.getIntvalMax(json.series[0].issue_data,json.series[0].mission_data),
                    setMax_1 = setIntval_1 * 7,
                    setIntval_2 = _self.getIntvalMax(json.series[0].rate_data,[0]),
                    setMax_2 = setIntval_2 * 7;

                myChart.setOption({
                    xAxis: [
                        { data: json.xdata },
                        { data: json.xdata }
                    ],
                    yAxis:[
                        {
                            interval: setIntval_1,
                            max: setMax_1
                        },
                        {
                            interval: setIntval_2,
                            max: setMax_2
                        }
                    ],
                    series: [
                        { data : json.series[0].issue_data },
                        { data : json.series[0].mission_data },
                        {
                            markPoint : {
                                data: mark_res
                            },
                            data : data_res
                        }
                        //{ data : json.series[0].rate_data}
                    ]
                })
            }
        },
        teamRank : function(json){
            var htm = '', _self = this;
            $.each(json.data,function(idx,val){
                var this_data = this, val = _self.formatNumber(this_data.issue,0);
                if(idx <= 2){
                    htm += '<tr>'+
                                '<td><img src="img/num-'+(idx+1)+'.png" alt=""></td>'+
                                '<td>'+this_data.name+'</td>'+
                                '<td>'+val+'</td>'+
                            '</tr>';
                }else{
                    htm += '<tr>'+
                                '<td>'+(idx+1)+'</td>'+
                                '<td>'+this_data.name+'</td>'+
                                '<td>'+val+'</td>'+
                            '</tr>';
                }
            });
            $('.tabli-td .tab-rank>tbody').html(htm);
        },
        groupRank : function(json){
            var htm_left = '', htm_right = '', _self = this;
            $.each(json.data,function(idx,val){
                var this_data = this, val = _self.formatNumber(this_data.issue,0);
                if(idx < 12){
                    if(idx <= 2){
                        htm_left += '<tr>'+
                            '<td><img src="img/num-'+(idx+1)+'.png" alt=""></td>'+
                            '<td>'+this_data.name+'</td>'+
                            '<td>'+val+'</td>'+
                            '</tr>';
                    }else{
                        htm_left += '<tr>'+
                            '<td>'+(idx+1)+'</td>'+
                            '<td>'+this_data.name+'</td>'+
                            '<td>'+val+'</td>'+
                            '</tr>';
                    }
                }else{
                    htm_right += '<tr>'+
                        '<td>'+(idx+1)+'</td>'+
                        '<td>'+this_data.name+'</td>'+
                        '<td>'+val+'</td>'+
                        '</tr>';
                }
            });
            $('.tabli-xz .half-l>tbody').html(htm_left);
            $('.tabli-xz .half-r>tbody').html(htm_right);
        },
        personalRank : function(json){
            var htm = '', _self = this;
            $.each(json.data,function(idx,val){
                var this_data = this, val = _self.formatNumber(this_data.issue,0);
                if(idx <= 2){
                    htm += '<tr>'+
                        '<td><img src="img/num-'+(idx+1)+'.png" alt=""></td>'+
                        '<td>'+this_data.group+'</td>'+
                        '<td>'+this_data.salesman+'</td>'+
                        '<td>'+val+'</td>'+
                        '</tr>';
                }else{
                    htm += '<tr>'+
                        '<td>'+(idx+1)+'</td>'+
                        '<td>'+this_data.group+'</td>'+
                        '<td>'+this_data.salesman+'</td>'+
                        '<td>'+val+'</td>'+
                        '</tr>';
                }
            });
            $('.set-month').html(json.month);
            $('.tabli-gr .tab-rank>tbody').html(htm);
        },
        groupFinish : function(json){
            var j_len = json.data.length, _self = this;
            if(j_len > 0){
                var htm = '', str = '', tab_len = 0;
                $.each(json.data,function(idx,val){
                    var this_data = this,
                        week_contract = _self.formatNumber(this_data.week_contract,0),
                        week = _self.formatNumber(this_data.week_total,0),
                        month_contract = _self.formatNumber(this_data.month_contract,0),
                        month = _self.formatNumber(this_data.month_total,0);
                    str += '<tr class="">'+
                                '<td>'+json.data[idx].group+'</td>'+
                                '<td>'+week_contract+'</td>'+
                                '<td>'+week+'</td>'+
                                '<td>'+month_contract+'</td>'+
                                '<td>'+month+'</td>'+
                            '</tr>';
                    if(((idx+1)%5 === 0 && idx !== 0) || (idx+1) === j_len){
                        tab_len++;
                        htm += '<table class="tab-list swiper-slide">'+
                                    '<tbody class="">'+str+'</tbody>' +
                               '</table>';
                        str = '';
                    }
                });
                $('#ubox3').css({'width':(100*tab_len)+'%'});
                $('#ubox3>.tab-list').css({'width':(100/tab_len)+'%'});
                $('#ubox3').html(htm);

                var swiper4 = new Swiper('.swiper4', {
                    autoplay: 5000,
                    loop: true,
                    autoplayDisableOnInteraction: false
                });
                if(j_len <= 5){
                    swiper4.stopAutoplay();
                }
            }
        },
        personalRate : function(json){
            var j_len = json.data.length, _self = this;
            if(j_len > 0){
                var htm = '', str = '', tab_len = 0;
                $.each(json.data,function(idx,val){
                    var this_data = this, month_val = _self.formatNumber(this_data.month_mission,0), finish_val = _self.formatNumber(this_data.month_finish,0);
                    //var rate = this_data.month_finish / this_data.month_mission
                    if(this_data.rate >= 100){
                        str += '<tr class="fc-yellow">';
                    }else{
                        str += '<tr>';
                    }
                    str += '<td>'+json.data[idx].group+'</td>'+
                            '<td>'+json.data[idx].salesman+'</td>'+
                            '<td>'+finish_val+'</td>'+
                            '<td>'+month_val+'</td>'+
                            '<td>'+json.data[idx].rate+'%</td>'+
                        '</tr>';
                    if(((idx+1)%5 === 0 && idx !== 0) || (idx+1) === j_len){
                        tab_len++;
                        htm += '<table class="tab-list swiper-slide">'+
                                    '<tbody class="">'+str+'</tbody>' +
                                '</table>';
                        str = '';
                    }
                });
                $('#ubox2').css({'width':(100*tab_len)+'%'});
                $('#ubox2>.tab-list').css({'width':(100/tab_len)+'%'});
                $('#ubox2').html(htm);

                var swiper3 = new Swiper('.swiper3', {
                    autoplay: 5000,
                    loop: true,
                    autoplayDisableOnInteraction: false
                });
                if(j_len <= 5){
                    swiper3.stopAutoplay();
                }
            }
        },
        groupRate : function(json){
            var j_len = json.data.length,
                _self = this;
            if(j_len > 0){
                var htm = '', str = '', tab_len = 0;
                $.each(json.data,function(idx,val){
                    var this_data = this, mission = _self.formatNumber(json.data[idx].month_mission,0), finish = _self.formatNumber(this_data.month_finish,0);
                    //console.log(mission)
                    //var rate = this_data.month_finish / this_data.month_mission
                    if(this_data.rate >= 100){
                        str += '<tr class="fc-yellow">';
                    }else{
                        str += '<tr>';
                    }
                    str += '<td>'+json.data[idx].group+'</td>'+
                                '<td>'+finish+'</td>'+
                                '<td>'+mission+'</td>'+
                                '<td>'+json.data[idx].rate+'%</td>'+
                            '</tr>';
                    if(((idx+1)%5 === 0 && idx !== 0) || (idx+1) === j_len){
                        tab_len++;
                        htm += '<table class="tab-list swiper-slide">'+
                                    '<tbody class="">'+str+'</tbody>' +
                                '</table>';
                        str = '';
                    }
                });
                $('#ubox1').css({'width':(100*tab_len)+'%'});
                $('#ubox1>.tab-list').css({'width':(100/tab_len)+'%'});
                $('#ubox1').html(htm);

                var swiper2 = new Swiper('.swiper2', {
                    autoplay: 5000,
                    loop: true,
                    autoplayDisableOnInteraction: false
                });
                if(j_len <= 5){
                    swiper2.stopAutoplay();
                }
            }
        },
        getNews : function(json){
            var j_len = json.data.length,
                _self = this;
            if(j_len > 0){
                var htm = '';
                $.each(json.data,function(idx,val){
                    var this_data = this;
                    //if(this_data.special){
                        htm += '<div><span class="fc-orange">【'+this_data.category+'】</span>'+this_data.detail+'</div>'
                    //}else{
                    //    htm += '<div>【'+this_data.category+'】'+this_data.detail+'</div>'
                    //}
                });
                $('marquee').html(htm);
            }
        },
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
        /*计算图表interval值*/
        getIntvalMax: function (arr1,arr2){
            var concatArr = arr1.concat(arr2),
                maxInArr = concatArr.sort(this.sortNumber)[0];
            if(maxInArr < 1 || maxInArr === null || maxInArr === undefined){
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
        },
        sortNumber: function (a,b){
            return b - a
        },
        GetRequest : function() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = new Object();
            if (url.indexOf("?") != -1) {
                var str = url.substr(1), strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        },
        swiperRank : function (){
            var _self = this;
            var swiper1 = new Swiper('#rank', {
                spaceBetween: 10,
                centeredSlides: true,
                autoplay: 15000,
                loop: true,
                autoplayDisableOnInteraction: false,
                onSlideChangeEnd:function(e){
                    if(e.activeIndex === 2){
                        $('#title_toggle').html('小组');
                        /*图表*/
                        _self.Request( { _url: data_url.south_echart,_type:'GET', _data: {"userId":"5","password":"715d048ca9c63ae12beba3d2a07a24cf","extent":"季度"} }, function (ret) { _self.setCharts(ret);});
                        $('.time-scale>li').removeClass('active');
                        $('.time-scale>li:eq(1)').addClass('active');
                    }else if(e.activeIndex === 3){
                        $('#title_toggle').html('个人');
                        /*图表*/
                        _self.Request( { _url: data_url.south_echart,_type:'GET', _data: {"userId":"5","password":"715d048ca9c63ae12beba3d2a07a24cf","extent":"月度"} }, function (ret) { _self.setCharts(ret);});
                        $('.time-scale>li').removeClass('active');
                        $('.time-scale>li:eq(2)').addClass('active');
                    }else if(e.activeIndex === 4){
                        $('#title_toggle').html('团队');
                        /*图表*/
                        _self.Request( { _url: data_url.south_echart,_type:'GET', _data: {"userId":"5","password":"715d048ca9c63ae12beba3d2a07a24cf","extent":"年度"} }, function (ret) { _self.setCharts(ret);});
                        $('.time-scale>li').removeClass('active');
                        $('.time-scale>li:eq(0)').addClass('active');
                    }
                }
            });
        },
        init : function(){
            var _self = this;
            if(_self.interval != null){
                clearInterval(_self.interval);
            }

            /*获取url中cityName与transCompany值*/
            var city = func.GetRequest().city,
                trans = func.GetRequest().trans;

            /*顶部全年数据、南区签约数量、总额*/
            _self.Request( { _url: data_url.south_main, _type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.setMaindata(ret);});
            /*图表*/
            _self.Request( { _url: data_url.south_echart,_type:'GET', _data: {"userId": uid,"password": password,"extent":"年度"} }, function (ret) { _self.setCharts(ret);});
            /*团队月度排行榜*/
            _self.Request( { _url: data_url.south_team_rank,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.teamRank(ret);});
            /*小组月度排行榜*/
            _self.Request( { _url: data_url.south_group_rank,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.groupRank(ret);});
            /*个人月度排行榜*/
            _self.Request( { _url: data_url.south_personal_rank,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.personalRank(ret);});
            /*小组完成情况 (单位:元)*/
            _self.Request( { _url: data_url.group_rate,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.groupRate(ret);});
            /*个人完成情况 (单位:元)*/
            _self.Request( { _url: data_url.personal_rate,_type:'GET', _data: {"userId": uid,"password": password,"cityName":city,"transCompany":trans} }, function (ret) { _self.personalRate(ret);});
            /*小组签约合同数量和金额 (本周和本月)*/
            _self.Request( { _url: data_url.group_finish,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.groupFinish(ret);});
            /*底部消息*/
            _self.Request( { _url: data_url.news,_type:'GET', _data: {"userId": uid,"password": password} }, function (ret) { _self.getNews(ret);});

            _self.swiperRank();
        }
    };

    func.init();
})
