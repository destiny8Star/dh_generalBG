<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div style="display: flex;align-items: center;justify-content: space-between">
                <div class="third-nav-t">出库列表</div>
                <!--<el-button style="margin: 0 30px" size="small" type="primary" @click = "$router.push('/device')">返回</el-button>-->
            </div>

            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" v-loading="loading">

                        <!-- top数据展示 start -->
                        <div class="home-figure show-data" >
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

                        <!--搜索条件 start -->
                        <el-form :inline="true" :model="postData" class="demo-form-inline">
                            <el-row>
                                <el-form-item label="出库编号">
                                    <el-input v-model="postData.order_no" placeholder="请输入出库编号"></el-input>
                                </el-form-item>
                                <el-form-item label="日期">
                                    <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期" format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="出库对象">
                                    <el-input v-model="postData.agent_name" maxlength="11" placeholder="代理商"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit" size="small">
                                        查询
                                    </el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button size="small" type="primary" @click = "$router.push('/device/exportDevice')">设备出库</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                        <!--搜索条件 end -->
                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column prop="order_no" label="出库编号">
                                </el-table-column>
                                <el-table-column prop="out_time" label="出库时间">
                                </el-table-column>
                                <el-table-column prop="device_count" label="出库设备数">
                                </el-table-column>
                                <el-table-column prop="agent_name" label="出库对象">
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">详情
                                        </el-button>
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
                    </div>
                </div>
                <common-footer></common-footer>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonFooter from '../../../components/CommonFooter.vue'
    let map = {1: '直连', 2: '间连','直连': 1, '间连': 2};
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
                loading: false,
                showList: [
                    {
                        label: '出库订单数',
                        value: 0
                    },
                    {
                        label: '设备总数',
                        value: 0
                    }
                ],
                tableData: [],
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
                    "order_no": "",
                    "agent_name": "",
                    "start_time": '',
                    "end_time": '',
                    'date':''
                },
            }
        },
        methods: {
            /**
             *  选择时间
             */
            changeDate(val) {
                console.log(val);
                if (val) {
                    let start = new Date(val[0]),end = new Date(val[1]);
                    console.log(start,end);
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
                // this.multipleSelection = val;
            },
            // 详情
            handleClick(data) {
                console.log(data);
                this.$router.push({path:'/device/delivery/detail',query:{orderNo:data.order_no}})
            },
            onSubmit() {
                console.log('submit!');
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            //获取topdata
            getTop(){
                this.$axios.post('/admin/devices/out/order/top')
                    .then(res=>{
                        if(res.data.code === this.$webConfig.httpSuccessStatus){
                            console.log(res);
                            this.showList[0].value = res.data.data.order_count
                            this.showList[1].value = res.data.data.device_count
                        }else{
                            this.$message.error(res.data.message)
                        }
                        console.log("获取统计",res)
                    })
                    .catch(rej=>{
                        this.$message.error('网络异常')
                    })
            },
            //获取数据
            getData() {
                this.loading = true;
                //初始化列表
                this.$axios.post('/admin/devices/out/order', this.postData).then(res => {
                    this.loading = false;
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.tableData.forEach(ele=>{
                            ele.pay_channel_type = map[ele.pay_channel_type];
                        })
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    }else{
                        this.$message.error(res.data.message)
                    }
                })
                    .catch(() => {
                        this.loading = false;
                        this.$message.error("网络异常")
                    });
            },
        },
        mounted() {
            this.getTop()
            this.getData()
        }
    }
</script>

<style>
    .el-date-editor--datetimerange {
        width: 230px!important;
        margin-top: 4px;
    }
    .main-inner {
        padding: 13px 40px;
    }
</style>
