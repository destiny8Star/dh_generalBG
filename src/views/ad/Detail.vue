<template>
	<div>
		<div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
			<div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
				<div class="main-feature">
					<div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}">
						<h1 class="ly-title-one">广告详情 <el-button type="primary" size="mini" style="float: right;margin-top: 10px" @click="$router.push('/ad')">返回</el-button> </h1>
						<div class="infoBox">
							<div class="home-title">
								<span class="home-title-t">基本信息</span>
							</div>
							<el-card class="realBox">
								<!--<p v-for="(ele,i) in infoData" :key="i">{{ele.table}}：<span>{{ele.value}}</span></p>-->
								<div v-for="(ele,i) in infoData" :key="i" class="realBoxItem">
									<p style="width: 110px">{{ele.table}}：</p>
									<div class="realBoxItemVal">
										<p v-if="i!=5">{{ele.value}}</p>
										<div v-else-if="i==5" class="realBoxItemImgBox">
											<div>
												<img :src="ele.value" alt="">
												<p v-if="type==2">跳转前</p>
											</div>
											<div v-show="type==2&&ele.value2">
												<img :src="ele.value2" alt="">
												<p>跳转后</p>
											</div>
										</div>
									</div>
								</div>
							</el-card>
							<!-- <template></template> -->
							<div class="home-title">
								<span class="home-title-t">{{type == 1?'投放对象列表':'广告数据效果'}} </span>
							</div>
							<!-- 搜索条件 start -->
							<!-- 广告数据效果 top数据展示 start -->
							<!--<p v-if="type == 2">浏览总量（次）： 100000</p>-->
							<div class="home-figure show-data" v-if="type == 2">
								<el-row :gutter="10" style="margin: 0 0 20px">
									<el-col :sm="4" v-for="(ele,i) in showList" :key="i">
										<div class="grid-content" v-if="i==0">
											<div class="home-figure-content">{{ele.label}}</div>
											<div class="home-figure-num">{{ele.num}}</div>
										</div>
										<div class="grid-content" v-if="i==1&&ele.num!=null">
											<div class="home-figure-content">{{ele.label}}</div>
											<div class="home-figure-num">{{ele.num}}</div>
										</div>
									</el-col>
								</el-row>
							</div>
							<!-- 广告数据效果 top数据展示 end -->
							<el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline" v-if="type == 2">
								<el-form-item label="日期">
									<el-date-picker
											@change="changeDate"
											v-model="postData.dates"
											type="date"
											placeholder="选择日期">
									</el-date-picker>
								</el-form-item>
								<el-form-item>
									<el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
								</el-form-item>
							</el-form>

							<!-- 表格 start -->
							<template>
								<el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px">
									<el-table-column type="index" fixed width="80" label="序号" :key="1">
										<template slot-scope="scope">{{ ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1)}}
										</template>
									</el-table-column>
									<el-table-column prop="device_no" label="设备SN" :key="2">
									</el-table-column>
									<el-table-column prop="img_url_pv" label="跳转前曝光量" :key="3" v-if="type == 2">
									</el-table-column>
									<el-table-column prop="img_h5_url_pv" label="跳转后曝光量" :key="4" v-if="type == 2">
										<template slot-scope="scope">
											<p>{{scope.row.img_h5_url_pv ? scope.row.img_h5_url_pv : '--'}}</p>
										</template>
									</el-table-column>
									<el-table-column prop="mer_name" label="商户名" :key="5">
									</el-table-column>
									<el-table-column prop="store_name" label="门店名" :key="6">
										<template slot-scope="scope">
											<p>{{scope.row.store_name ? scope.row.store_name : '--'}}</p>
										</template>
									</el-table-column>
								</el-table>
							</template>
							<!-- 表格 end -->
							<template>
								<div class="block" style="text-align: center;margin-top: 30px;">
									<el-pagination @size-change="handleSizeChange"
												   @current-change="jumpPagination"
												   @prev-click="prevClick"
												   @next-click="nextClick"
												   :current-page="pagination.currentPage"
												   :page-sizes="pagination.pageCount"
												   :page-size="pagination.pageSize"
												   layout="total, sizes, prev, pager, next, jumper"
												   :total="pagination.total">
									</el-pagination>
								</div>
							</template>

							<div class="home-title" v-if="type==2">
								<span class="home-title-t">广告投放数据折线图</span>
							</div>
							<div v-if="type==2" id="myChart" :style="{width: '70%', height: '500px'}"></div>
						</div>

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
        name: "detail",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data: function () {
            return {
                searchState: false,
                loading: false,
                mapType: {1:'支付前广告',2:'支付后广告'},
                mapStatus: {0:'已结束',1:'投放中',2:'待生效'},
                type:'1', //1、支付前广告  2、支付后广告
                //页面所需
                "pagination": {
                    "total": 0,
                    "pageCount": [10,20,50,100],
                    "currentPage": 1,
                    "pageSize": 10,
                    "show": '1-5'
                },
                //接口参数
                "postData": {
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                    "date": '',
                    "dates": '',
                    "id": '',
                },
                tableData: [ ],//表格
                infoData: [
                    {
                        table: '投放服务商',
                        value: ''
                    },
                    {
                        table: '广告类别',
                        value: ''
                    },
                    {
                        table: '广告名称',
                        value: ''
                    },
                    {
                        table: '投放时间',
                        value: ''
                    },
                    {
                        table: '广告图名称',
                        value: ''
                    },
                    {
                        table: '广告图片',
                        value: '',
                        value2: ''
                    },
                    {
                        table: '投放行业',
                        value: ''
                    },
                    {
                        table: '投放商户数',
                        value: ''
                    },
                    {
                        table: '投放设备数',
                        value: ''
                    },
                    {
                        table: '投放状态',
                        value: ''
                    },
                ],
                showList: [
                    {
                        label: '跳转前浏览总量（次）',
                        num: '10'
                    },
                    {
                        label: '跳转后浏览总量（次）',
                        num: '1'
                    }
                ],
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
                        data: ['跳转前曝光量','跳转后曝光量']
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
                        // name: '单位(次)',
                        axisLine: {
                            lineStyle: {
                                // 设置x轴颜色
                                color: '#303133'
                            }
                        },
                    },
                    series: [
                        {
                            name: '跳转前曝光量',
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
                            name: '跳转后曝光量',
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
                }
            }
        },
        methods: {
            /**
             * 选择时间 值有改变
             * @param val 选中的时间
             */
            changeDate(val) {
                console.log(val, this.postData.dates);
                if (val) {
                    this.postData.date = val.valueOf();
                } else {
                    this.postData.date =  '';
                }
            },
            /**
             * 查询
             */
            onSubmit() {
                console.log('submit!');
                this.searchState = true;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getData();
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage --;
                this.postData.cursor --;
                this.getData();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage ++;
                this.postData.cursor ++;
                this.getData();
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagination.size = this.postData.size = val;
                this.getData();
            },
            /**
             * 获取数据
             */
            getData() {
                //初始化列表
                this.searchState = true;
                this.$axios.post('/admin/advertising/ad/listAdStatistics',this.postData).then(res => {
                    console.log('获取列表数据',res);
                    this.searchState = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        console.log(this.tableData);
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {
                        this.searchState=false;
                        console.log('错误',rej);
                        this.$message('网络异常!');
                    });
            },
            /**
             * 获取详情数据
             */
            getDetail() {
                //初始化列表
                this.$axios.post('/admin/advertising/ad/get',{"id":this.postData.id}).then(res => {
                    console.log('获取详情数据',res);
                    this.searchState = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let info = res.data.data;
                        this.infoData[0].value = info.agent_name;
                        this.infoData[1].value = this.mapType[info.ad_type];
                        this.infoData[2].value = info.ad_name;
                        this.infoData[3].value = info.valid_time;
                        this.infoData[4].value = info.poster_name;
                        this.infoData[5].value = info.poster_url;
                        this.infoData[5].value2 = info.poster_h5_url;
                        this.infoData[6].value = info.industry_desc;
                        this.infoData[7].value = info.mer_count;
                        this.infoData[8].value = info.device_count;
                        this.infoData[9].value = this.mapStatus[info.status];
                        console.log(this.infoData);

                        this.showList[0].num = info.img_url_pv;
                        this.showList[1].num = info.img_h5_url_pv;
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {
                        this.searchState=false;
                        console.log('错误',rej);
                        this.$message('网络异常!');
                    });
            },
            /**
             * 获取详情数据
             */
            getEchartsDate() {
                //初始化列表
                this.$axios.post('/admin/advertising/ad/adStatisticsViewData',{"id":this.postData.id}).then(res => {
                    console.log('获取详情数据',res);
                    this.searchState = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;
                        this.echartsOption.xAxis.data = list.dates;
                        this.echartsOption.series[0].data = list.img_url_pv;
                        if(list.img_h5_url_pv){
                            this.echartsOption.series[1].data = list.img_h5_url_pv;
                        }else {
                            this.echartsOption.series[1] = null
                        }
                        this.drawLine();
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {
                        this.searchState = false;
                        console.log('错误',rej);
                        this.$message('网络异常!');
                    });
            },
            /**
             *  初始化echarts列表
             */
            drawLine(){
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById('myChart'));
                // 绘制图表
                myChart.setOption( this.echartsOption);
            },
        },
        created(){
            if(this.$route.query.type){
                this.type = this.$route.query.type;
                this.postData.id = this.$route.query.adId
            }
        },
        mounted(){
            // 获取数据
            this.getData();
            this.getDetail();
            // 折线图
            if(this.type==2){
                this.getEchartsDate();
            }
        }
    }
</script>

<style scoped>
	.el-date-editor.el-input {
		width: auto;
	}
	.home-title {
		margin: 20px 0 10px;
		font-weight: 800;
	}
	.main-inner {
		padding: 13px 40px;
	}
	.realBox {
		width: 60%;
		min-width: 580px;
		max-width: 880px;
		line-height: 32px;
		margin: 20px 20px 2px 0;
	}
	.realBoxItem ,.realBoxItemVal,.realBoxItemImgBox{
		display: flex;
		align-items: flex-start;
	}
	.realBoxItemImgBox div{
		margin-right: 20px;
	}
	.realBoxItemVal img{
		width: 200px;
		height: 150px;
		margin-top: 20px;
	}
	.realBoxItemImgBox p{
		text-align: center;
		margin: 0;
	}
</style>

