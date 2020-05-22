<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <div class="third-nav-t">代理商列表</div>
            </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">

                        <!-- 搜索条件 start -->
                        <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline" style="margin-top: 20px">
                            <el-form-item label="日期">
                                <!--:default-time="['12:00:00']"-->
                                <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="用户名">
                                <el-input v-model="postData.name" placeholder="请输入用户名" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="审核状态">
                                <el-select v-model="postData.audit" placeholder="请选择审核状态" clearable>
                                    <el-option v-for="item in auditState"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色">
                                <el-select v-model="postData.level" placeholder="请选择角色" clearable>
                                    <el-option v-for="item in roleList"
                                               :key="item.level"
                                               :label="item.desc"
                                               :value="item.level"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- 搜索条件 end -->


                        <!--<p class="hintText" style="color: #999;margin-top: 0">提示：展示可获取分润的服务商或分销商列表，分润在 【数据中心】查看</p>-->
                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column type="index" fixed width="80" label="编号">
                                    <template slot-scope="scope">{{ ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1)}}
                                    </template>
                                    <!--   <template slot-scope="scope">{{ pagination.total - ( ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1) ) + 1}}
                                       </template>-->
                                </el-table-column>
                                <!-- <el-table-column prop="agent_no" label="编号">
                                 </el-table-column>-->
                                <el-table-column prop="agent_name" label="代理商名">
                                </el-table-column>
                                <el-table-column prop="real_name" label="姓名">
                                </el-table-column>
                                <el-table-column prop="mobile" label="手机号">
                                </el-table-column>
                                <el-table-column prop="level_desc" label="角色">
                                </el-table-column>
                                <el-table-column prop="profit_rate" label="分润比例（%）">
                                    <template slot-scope="scope">
                                        {{ scope.row.profit_rate }} %
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
    const map = {1:'已支付',2:'未支付', 3:'已退款', 4:'订单关闭'};//角色
    export default {
        name: "list",
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
                unlink: true,
                searchState: false,
                date: new Date(),
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
                    "name": '',
                    "level": '',
                    "audit": '',
                    "date": '',
                    "start_time": '',
                    "end_time": '',
                },
                roleList: [
                    {
                        value: '1',
                        label: '城市服务商'
                    },
                    {
                        value: '2',
                        label: '区域服务商'
                    },
                    {
                        value: '3',
                        label: '执行服务商'
                    },
                    {
                        value: '4',
                        label: '分销商'
                    }
                ],
                auditState: [
                    {
                        value: '1',
                        label: '直推'
                    },
                    {
                        value: '2',
                        label: '间推'
                    }
                ],
                tableData: [],
            }
        },
        methods: {
            /**
             *  选择时间
             */
            changeDate(val) {
                console.log(val, this.postData.date);
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
             * 获取角色list
             */
            getRolData() {
                //初始化列表
                this.$axios.post('/agent/sys/getLevel').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.roleList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {

                    });
            },
            /**
             * 获取列表数据
             */
            getData() {
                console.log(this.postData);
                //初始化列表
                this.$axios.post('/agent/team/showTeam', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.tableData.forEach(ele=>{
                            ele.status = map[ele.status];
                            ele.create_time = new Date(ele.create_time).format('yyyy-MM-dd hh:mm:ss');
                        });
                        console.log(this.tableData);
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    }
                    this.searchState = false;
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            /**
             * 获取列表数据 - 顶部数据
             */
            getShowData() {
                //初始化列表
                this.$axios.post('/agent/team/totalAgentCount',this.form).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.showList = res.data.data;
                    }
                })
                    .catch(() => {

                    });
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
            open() {
                this.$confirm('确定删除此商品吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        beforeMount() {
            // 获取列表数据
            this.getData();
            this.getShowData();
            //    获取角色list
            this.getRolData();
        },
    }
</script>


<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
</style>
