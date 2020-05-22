<template>
	<div>
		<div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
			<div class="third-nav">
				<div class="third-nav-t">首页</div>
			</div>
			<div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
				<div class="main-feature">
					<div class="main-inner">
						<!-- 饼状图 start -->
						<div class="ly-pie-box">
							<div class="ly-pie">
								<div class="ly-data-box">
									<p>总商户数：</p> <span>{{merchantTotal}}</span>
								</div>
								<div id="myPieChart" :style="{width: '100%', height: '300px'}"></div>
							</div>
							<div class="ly-pie">
								<div class="ly-data-box ly-today">
									<p>今日新增：</p> <span>{{merchantAdd}}</span>
								</div>
								<div id="myPieChartToday" :style="{width: '100%', height: '300px'}"></div>
							</div>
						</div>
						<!-- 饼状图 end -->


						<div class="home-figure" style="margin: 40px 0 60px">
							<el-row :gutter="10" style="margin: 20px 0">
								<el-col :sm="4" v-for="(ele,i) in showList" :key="i">
									<div class="grid-content">
										<div class="home-figure-content">{{ele.name}}</div>
										<div class="home-figure-num">{{ele.value}}</div>
									</div>
								</el-col>
							</el-row>
						</div>

						<!--<h1 class="ly-title-one" style="margin-bottom: 20px">分润趋势图</h1>-->

						<!-- tab按钮 start -->
						<div class="third-nav">
							<el-tabs v-model="formInline.label" type="card" @tab-click="tabSelect">
								<el-tab-pane v-for="(ele,i) in tabList" :key="i" :label="ele.label" :name="ele.value"></el-tab-pane>
							</el-tabs>
						</div>
						<!-- tab按钮 end -->

						<!-- 搜索条件 start -->
						<el-form :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0">
							<el-form-item label="日期" class="bill-collect-date">
								<el-date-picker @change="changeDate" v-model="formInline.date" type="datetimerange" start-placeholder="开始日期"
												end-placeholder="结束日期" format="yyyy-MM-dd" clearable>
									<!--&lt;!&ndash;:default-time="['12:00:00']"&ndash;&gt;-->
								</el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
							</el-form-item>
						</el-form>
						<!-- 搜索条件 end -->

						<div id="myChart" :style="{width: '70%', height: '500px'}"></div>
						<!--<div id="myChart" :style="{width: '70%', height: '500px', margin: '0 15%'}"></div>-->
					</div>
				</div>
				<common-footer></common-footer>
			</div>
		</div>
	</div>
</template>

<script>
    import CommonFooter from '../../components/CommonFooter.vue'

    export default {
        name: "list",
        components: {
            // third_nav,
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            return {
                winHeight: window.innerHeight,
                merchantTotal: '',//总商户数
                merchantAdd: '',//今日新增商户数
                formInline: {
                    date: [],
                    start_time: '',
                    end_time: '',
                    label: '1',
                },
                showList: [
                   /* {
                        label: '今日交易金额(元)',
                        num: 3
                    },
                    {
                        label: '今日商户分润(元)',
                        num: 346
                    },
                    {
                        label: '今日区域分润(元)',
                        num: 78
                    }*/
                ],
                date: new Date(),
                searchState: false,

                echartsOption: {
                    // backgroundColor: '#FFF0F5',
                    title: {
                        // text: '折线图', //主标题
                        // subtext: '模拟数据',  //副标题
                        // x: 'center'
                    },
                    legend: {
                        // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                        orient: 'horizontal',
                        // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'center',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 'top',
                        data: ['交易笔数(笔)','商户分润(元)']
                    },

                    //  图表距边框的距离,可选值：'百分比'¦ {number}（单位px）
                    grid: {
                        top: '16%',   // 等价于 y: '16%'
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true
                    },

                    // 提示框
                    tooltip: {
                        // trigger: 'axis'
                    },
                    xAxis: {
                        name: '单位/天',
                        type: 'category',
                        axisLine: {
                            lineStyle: {
                                // 设置x轴颜色
                                color: '#303133'
                            }
                        },
                        // 设置X轴数据旋转倾斜
                        axisLabel: {
                            // rotate: 30, // 旋转角度
                            interval: 0  //设置X轴数据间隔几个显示一个，为0表示都显示
                        },
                        // boundaryGap值为false的时候，折线第一个点在y轴上
                        boundaryGap: true,
                        data: ["9.22","9.23","9.24","9.25","9.26","9.27"]
                    },
                    yAxis: {
                        // name: '单位(天)',
                        axisLine: {
                            lineStyle: {
                                // 设置x轴颜色
                                color: '#303133'
                            }
                        },
                    },
                    series: [
                        {
                            name: '交易笔数(笔)',
                            type: 'line',
                            data: [5, 20, 36, 10, 10, 20],
                            // 设置折线上圆点大小
                            symbolSize: 4,
                            itemStyle:{
                                normal:{
                                    // 拐点上显示数值
                                    label : {
                                        show: true
                                    },
                                    // borderColor:'red',  // 拐点边框颜色
                                    // lineStyle:{
                                    //     // width:3,  // 设置线宽
                                    //     type:'dotted'  //'dotted'虚线 'solid'实线
                                    // }
                                }
                            }
                        },
                        {
                            name: '商户分润(元)',
                            data: [20, 32, 41, 34, 16, 130, 20],
                            type: 'line',
                            // 设置折线上圆点大小
                            symbolSize: 4,
                            itemStyle:{
                                normal:{
                                    // 拐点上显示数值
                                    label : {
                                        show: true
                                    },
                                    borderColor:'red',  // 拐点边框颜色
                                    lineStyle:{
                                        // width:3,  // 设置线宽
                                        type:'dotted'  //'dotted'虚线 'solid'实线
                                    }
                                }
                            }
                        },
                    ],
                    color: ['#6698ee', '#FF9F7F']
                },
                echartsOptionPie: {
                    // backgroundColor: '#FFF0F5',
                    title: {
                        // text: '折线图', //主标题
                        // subtext: '模拟数据',  //副标题
                        // x: 'center'
                    },
                    legend: {
                        // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                        orient: 'vertical',
                        // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'left',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 'center',
                        itemWidth: 24,   // 设置图例图形的宽
                        itemHeight: 18,  // 设置图例图形的高
                        textStyle: {
                            color: '#666'  // 图例文字颜色
                        },
                        // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
                        itemGap: 30,
                        backgroundColor: '#eee',  // 设置整个图例区域背景颜色
                        data: ['服务商','创客','运营商','直属商户']
                        // data: ['分销商','执行服务商','区域服务商','直属商户']
                    },

                    //  图表距边框的距离,可选值：'百分比'¦ {number}（单位px）
                    grid: {
                        top: '16%',   // 等价于 y: '16%'
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true
                    },

                    // 提示框
                    tooltip: {
                        // trigger: 'axis'
                    },
                    series: [
                        {
                            name: '商户数',
                            type: 'pie',
                            // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
                            radius: ['0%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                            center: ['50%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
                            data: [
                                {value:335, name:'服务商'},
                                {value:310, name:'创客'},
                                {value:234, name:'运营商'},
                                {value:135, name:'直属商户'}
                               /* {value:335, name:'分销商'},
                                {value:310, name:'执行服务商'},
                                {value:234, name:'区域服务商'},
                                {value:135, name:'直属商户'}*/
                            ],
                            // itemStyle 设置饼状图扇形区域样式
                            itemStyle: {
                                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(30, 144, 255，0.5)'
                                }
                            },
                            // 设置值域的那指向线
                            labelLine: {
                                normal: {
                                    show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
                                }
                            },
                            // 设置值域的标签
                            label: {
                                normal: {
                                    position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                                    // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                                    // {a}指series.name  {b}指series.data的name
                                    // {c}指series.data的value  {d}%指这一部分占总数的百分比
                                    formatter: '{c}'
                                }
                            }
                        }
                    ],
                    color: ['#408EFF', '#2D64B3', '#3373CC', '#3981E6']
                },
                echartsOptionPieToday: {
                    // backgroundColor: '#FFF0F5',
                    title: {
                       /* text: '饼状图', //主标题
                        subtext: '模拟数据',  //副标题
                        x: 'center'*/
                    },
                    legend: {
                        // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
                        orient: 'vertical',
                        // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
                        x: 'left',
                        // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
                        y: 'center',
                        itemWidth: 24,   // 设置图例图形的宽
                        itemHeight: 18,  // 设置图例图形的高
                        textStyle: {
                            color: '#666'  // 图例文字颜色
                        },
                        // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
                        itemGap: 30,
                        backgroundColor: '#eee',  // 设置整个图例区域背景颜色
                        data: ['服务商','创客','运营商','直属商户']
                        // data: ['分销商','执行服务商','区域服务商','直属商户']
                    },

                    //  图表距边框的距离,可选值：'百分比'¦ {number}（单位px）
                    grid: {
                        top: '16%',   // 等价于 y: '16%'
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true
                    },

                    // 提示框
                    tooltip: {
                        // trigger: 'axis'
                    },
                    series: [
                        {
                            name: '商户数',
                            type: 'pie',
                            // radius: '50%',  // 设置饼状图大小，100%时，最大直径=整个图形的min(宽，高)
                            radius: ['30%', '60%'],  // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                            center: ['50%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
                            data: [
                                {value:335, name:'服务商'},
                                {value:310, name:'创客'},
                                {value:234, name:'运营商'},
                                {value:135, name:'直属商户'}
                                /*{value:335, name:'分销商'},
                                {value:310, name:'执行服务商'},
                                {value:234, name:'区域服务商'},
                                {value:135, name:'直属商户'}*/
                            ],
                            // itemStyle 设置饼状图扇形区域样式
                            itemStyle: {
                                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(30, 144, 255，0.5)'
                                }
                            },
                            // 设置值域的那指向线
                            labelLine: {
                                normal: {
                                    show: false   // show设置线是否显示，默认为true，可选值：true ¦ false
                                }
                            },
                            // 设置值域的标签
                            label: {
                                normal: {
                                    position: 'inner',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                                    // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                                    // {a}指series.name  {b}指series.data的name
                                    // {c}指series.data的value  {d}%指这一部分占总数的百分比
                                    formatter: '{c}'
                                }
                            }
                        }
                    ],
                    color: ['#BFDAFF', '#73ADFF', '#8CBCFF', '#A6CBFF']
                },

                tabIndex: '1',//tab选中值
                tabList: [
                    {
                        value: '1',
                        label: '商户分润趋势图'
                    },
                    {
                        value: '2',
                        label: '区域分润趋势图'
                    }
                ],
            }
        },
        methods: {
            /**
             *  初始化echarts列表
             */
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                // 绘制图表
                myChart.setOption( this.echartsOption);
            },
            /**
             *  初始化  饼状图 echarts列表
             */
            drawLinePie(){
                // 基于准备好的dom，初始化echarts实例
                let myPieChart = this.$echarts.init(document.getElementById('myPieChart'));
                let myPieChartToday = this.$echarts.init(document.getElementById('myPieChartToday'));
                // 绘制图表
                myPieChart.setOption( this.echartsOptionPie);
                myPieChartToday.setOption( this.echartsOptionPieToday);
            },
			/**
			 *  重置搜索条件 - 时间
			 */
			dateReset(){
                let time = new Date();
                var preDate = new Date(this.date.getTime() - 24*60*60*1000); //前一天
                var nextDate = new Date(this.date.getTime()); //后一天
                this.formInline.start_time = new Date(this.date.getTime() - 24*60*60*1000*7);
                this.formInline.end_time = new Date(this.date.getTime()); //今天
                this.formInline.date = [];
                this.formInline.date.push(this.formInline.start_time,this.formInline.end_time);
                console.log(this.formInline.date);
                this.changeDate(this.formInline.date);
			},
            /**
             * tab选择
             * @param key
             * @param keyPath
             */
            tabSelect(tab, event) {
                this.formInline.label = tab.name;
                console.log(tab.name, event,this.formInline.label);
                this.dateReset();
                this.getData();
            },
            /**
             * 获取 饼状图 数据
             */
            getPieData() {
                //初始化列表
                this.$axios.post('/agent/home/nowTotalMerData').then(res => {
                    console.log(res);
                    this.searchState = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;
                      /*  this.showList[0].num = list.today_payment;
                        this.showList[1].num = list.today_mer_profit;
                        this.showList[2].num = list.today_area_profit;*/
                        this.showList = list.today_statistical;

                        this.merchantTotal = list.total_mer_count;
                        this.merchantAdd = list.today_mer_count;

                        list.total_data.forEach(ele=>{
                            this.echartsOptionPie.legend.data.push(ele.name);
						});
                        list.today_data.forEach(ele=>{
                            this.echartsOptionPieToday.legend.data.push(ele.name);
						});
                        this.echartsOptionPie.series[0].data = list.total_data;
                        this.echartsOptionPieToday.series[0].data = list.today_data;
                        console.log(this.echartsOption);

                        //初始化列表
                        this.drawLinePie();
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            /**
             * 获取 折线图 数据
             */
            getData() {
                //初始化列表
                this.$axios.post('/agent/home/totalWeekMerData',this.formInline).then(res => {
                    console.log(res);
                    this.searchState = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;

                        this.echartsOption.xAxis.data = list.dates;
                        this.echartsOption.series[0].data = list.counts;
                        this.echartsOption.series[1].data = list.moneys;

                        console.log(this.echartsOption);

                        //初始化列表
                        this.drawLine();
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            /**
             * 选择时间 值有改变
             * @param val 选中的时间
             */
            changeDate(val){
                console.log(val,this.formInline.date);
                let start = new Date(val[0]),end = new Date(val[1]);
                console.log(start,end,Date.parse(start),Date.parse(end));
                this.formInline.start_time = start.valueOf();
                this.formInline.end_time = end.valueOf();
                console.log(this.formInline.start_time,this.formInline.end_time,this.formInline)
            },
            /**
			 * 查询
             */
            onSubmit() {
                this.searchState = true;
                console.log('submit!');
                this.getData();
            },
        },
        mounted(){
            // 重置时间
            this.dateReset();
            //获取数据
            this.getData();
            this.getPieData();

            // //初始化列表
            // this.drawLine();
            // this.drawLinePie();
        }
    }
</script>

<style scoped>
	.main-inner {
		padding: 13px 40px;
	}
	.el-date-editor--datetimerange {
		width: 240px!important;
		margin-top: 4px;
	}
	.ly-pie-box {
		margin-top: 40px;
		display: flex;
		align-items: center;
		/*justify-content: space-around;*/
	}
	.ly-pie {
		width: 40%;
	}
	.ly-data-box {
		padding: 0 10px;
		width: 180px;
		line-height: 40px;
		color: rgba(51,51,51,1);
		border: 1px solid rgba(64,142,255,1);
		border-radius: 10px;
		/*margin: 0 auto;*/
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.ly-today {
		border: 1px solid #C6E2FF!important;
	}
	.ly-today span{
		color: #73ADFF!important;
	}
	.ly-data-box p{
		font-size: 16px;
		margin: 0;
	}
	.ly-data-box span{
		font-size: 20px;
		font-weight: bold;
		color: rgba(64,142,255,1);
	}
</style>
