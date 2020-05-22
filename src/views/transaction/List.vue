<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <el-menu :default-active="tabIndex" class="el-menu-demo" mode="horizontal" @select="tabSelect">
                    <el-menu-item v-for="(ele,i) in tabList" :key="i" :index="ele.value">{{ele.label}}<!--（{{ele.num}}个）--></el-menu-item>
                </el-menu>
            </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" v-loading="loading">
                        <!--搜索条件 start -->
                        <el-form :inline="true" :model="postData" class="demo-form-inline" style="margin-top: 10px">
                            <el-row>
                                <el-form-item label="日期">
                                    <!--:default-time="['12:00:00']"-->
                                    <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期" format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit" size="small">
                                        查询
                                    </el-button>
                                </el-form-item>
                            </el-row>
                            <!-- top数据展示 start -->
                            <div class="home-figure show-data">
                                <el-row :gutter="30" style="margin: 0 0 40px">
                                    <el-col :sm="4" :span='2' v-for="(ele,i) in showList" :key="i">
                                        <div class="grid-content">
                                            <div class="home-figure-content">{{ele.label}}</div>
                                            <div class="home-figure-num">{{ele.value}}</div>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- top数据展示 end -->
                        </el-form>
                        <!--搜索条件 end -->
                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <!-- <el-table-column
                                         type="selection"
                                         width="55">
                                 </el-table-column>-->
                                <el-table-column prop="mer_name" label="商户名" :key="3">
                                </el-table-column>
                                <el-table-column prop="create_time" label="日期" :key="4">
                                </el-table-column>
                                <el-table-column prop="total_price" label="交易金额" :key="5">
                                </el-table-column>
                                <el-table-column prop="total_count" label="交易笔数" :key="6">
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
        name: "List",
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
                loading: false,
                tableData: [],
                selectionList: [],
                winHeight: window.innerHeight,
                //页面所需
                "pagination": {
                    "total": 0,
                    "pageCount": [10, 20, 50, 100],
                    "currentPage": 1,
                    "pageSize": 10,
                    "show": '1-5'
                },
                //接口参数
                "postData": {
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                    "channel_type": '1',//1:微信；2:支付宝；3:拉卡拉
                    "start_time": '',
                    "end_time": '',
                    "date": ''
                },
                tabIndex: '1',//tab选中值
                tabList: [
                    {
                        value: '1',
                        label: '微信',
                        num: 1
                    },
                    {
                        value: '2',
                        label: '支付宝',
                        num: 3
                    },
                    {
                        value: '3',
                        label: '拉卡拉',
                        num: 3
                    },
                ],
                showList: [
                    {
                        label: '总交易金额',
                        value: 0
                    },
                    {
                        label: '总交易笔数',
                        value: 0
                    }
                ],
            }
        },
        methods: {
            /**
             *  导出资料
             */
            derivedData() {
                console.log('导出资料');
            },
            /**
             *  选择时间
             */
            changeDate(val) {
                console.log(val);
                if (val) {
                    let start = new Date(val[0]), end = new Date(val[1]);
                    console.log(start, end);
                    this.postData.start_time = start.valueOf();
                    this.postData.end_time = end.valueOf();
                } else {
                    this.postData.start_time = this.postData.end_time = '';
                }
                console.log(this.postData)
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
                this.pagination.currentPage--;
                this.postData.cursor--;
                this.getData();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage++;
                this.postData.cursor++;
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
            handleSelectionChange(val) {
                this.selectionList = val;
                console.log(val, this.selectionList);
            },
            onSubmit() {
                console.log('submit!');
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getTop();
                this.getData();
            },
            //选择顶部tab
            tabSelect(key, keyPath) {
                console.log(key, keyPath);
                this.postData.channel_type = key;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.resetDate();
                this.getTop();
                this.getData();
            },
            //获取总交易金额，交易笔数
            getTop() {
                this.$axios.post('/admin/dataDayMer/total',this.postData)
                    .then(res => {
                        console.log("获取统计", res);
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.showList[0].value = res.data.data.total_money;
                            this.showList[1].value = res.data.data.total_pay_account
                        } else {
                            this.$message.error(res.data.message)
                        }
                    })
                    .catch(rej => {
                        this.$message.error('网络异常')
                    })
            },
            //获取数据
            getData() {
                this.loading = true;
                //初始化列表
                this.$axios.post('/admin/dataDayMer/list', this.postData).then(res => {
                    this.loading = false;
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
                    .catch(() => {
                        this.loading = false;
                        this.$message.error("网络异常")
                    });
            },
            /**
             * 重置时间
             */
            resetDate(){
                this.postData.date = '';
                let start, end, date = new Date();
                // start = date.getTime()-24*60*60*1000;
                start = date.getTime();
                end = date.getTime();
                this.postData.start_time = new Date(start).valueOf();
                this.postData.end_time = new Date(end).valueOf();
            }
        },
        mounted() {
            this.resetDate();
            this.getTop();
            this.getData()
        }
    }
</script>

<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }

    .main-inner {
        padding: 13px 40px;
    }
</style>
