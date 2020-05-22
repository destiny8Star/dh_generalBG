<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <el-menu :default-active="tabIndex" class="el-menu-demo" mode="horizontal" @select="tabSelect">
                    <el-menu-item v-for="(ele,i) in tabList" :key="i" :index="ele.value">{{ele.label}}（{{ele.num}}个）
                    </el-menu-item>
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
                                <el-form-item label="代理商/服务商">
                                    <el-input v-model="postData.agent_name"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit" size="small">
                                        查询
                                    </el-button>
                                </el-form-item>
                            </el-row>
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
                                <el-table-column prop="withdrawal_order_no" label="提现单号" :key="1">
                                </el-table-column>
                                <el-table-column prop="create_time" label="申请时间" :key="2">
                                    <template slot-scope="scope">
                                        <div>{{new Date(scope.row.create_time).format('yyyy-MM-dd hh:mm:ss')}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="代理商 / 服务商" :key="3">
                                </el-table-column>
                                <el-table-column prop="agent_mobile" label="手机号" :key="4">
                                </el-table-column>
                                <el-table-column prop="receiving_account" label="收款账号" :key="5">
                                </el-table-column>
                                <el-table-column prop="audit_time" label="审核时间" :key="6" v-if="postData.status!=0">
                                    <template slot-scope="scope">
                                        <div>{{new Date(scope.row.audit_time).format('yyyy-MM-dd hh:mm:ss')}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="price" label="提现金额" :key="7">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.price}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_level_desc" label="角色" :key="8">
                                </el-table-column>
                                <el-table-column prop="reason" label="驳回原因" v-if='postData.status==2' :key="9">
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" :key="10" v-if="postData.status==0">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row,1)" type="text">同意</el-button>
                                        <el-button @click="handleClick(scope.row,2)" type="text" style="color: red">拒绝</el-button>
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
                    "status": '0',//0待审核，1已提现，2已拒绝
                    "agent_name": "",//代理商/服务商
                    "start_time": '',
                    "end_time": '',
                    'date': ''
                },
                tabIndex: '0',//tab选中值
                tabList: [
                    {
                        value: '0',
                        label: '待审核',
                        num: 1
                    },
                    {
                        value: '1',
                        label: '已提现',
                        num: 3
                    },
                    {
                        value: '2',
                        label: '驳回',
                        num: 3
                    },
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
            //查看详情
            handleClick(data,num) {
                console.log(data,num);
                if(num==1){
                    this.agreeClick(data,num);
                }else if (num==2){
                    this.rejectClick(data,num);
                }
            },
            /**
             * 拒绝
             */
            rejectClick(ele,n){
                this.$prompt('请输入驳回理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '请输入驳回理由'
                }).then(({ value }) => {
                    let dataObj = {
                        "reason": value,
                        "status": n,
                        "withdrawal_order_no": ele.withdrawal_order_no
                    };
                    this.$axios.post('/admin/agentWithdrawal/auditWithdrawal',dataObj)
                        .then(res => {
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message.success('驳回成功');
                                this.getData()
                            } else {
                                this.$message.error(res.data.message)
                            }
                        })
                        .catch(rej => {
                            this.$message.error('网络异常!');
                            console.log('失败', rej)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            /**
             * 同意
             */
            agreeClick(ele,n){
                this.$confirm('此操作将同意该提现申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dataObj = {
                        "reason": '',
                        "status": n,
                        "withdrawal_order_no": ele.withdrawal_order_no
                    };
                    this.$axios.post('/admin/agentWithdrawal/auditWithdrawal', dataObj).then(res => {
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.$message({type: 'success', message: '审核通过!'});
                            this.getData();
                        } else {
                            this.$message(res.data.message);
                        }
                    }).catch((rej) => {
                        this.$message.error('网络异常!');
                        console.log('失败', rej)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同意操作'
                    });
                });
            },
            onSubmit() {
                console.log('submit!');
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            //选择顶部tab
            tabSelect(key, keyPath) {
                console.log(key, keyPath);
                this.postData.status = key;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData()
            },
            //获取待审核和驳回数据
            getTop() {
                this.$axios.get('/admin/agentWithdrawal/statistical')
                    .then(res => {
                        console.log("获取统计", res);
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.tabList[0].num = res.data.data.waiting_count;
                            this.tabList[1].num = res.data.data.success_count;
                            this.tabList[2].num = res.data.data.fail_count
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
                this.$axios.post('/admin/agentWithdrawal/listWithdrawal', this.postData).then(res => {
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
        },
        mounted() {
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
