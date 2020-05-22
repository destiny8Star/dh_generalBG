<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div style="display: flex;align-items: center;justify-content: space-between">
                <div class="third-nav-t">入库详情</div>
                <el-button style="margin: 0 30px" size="small" type="primary" @click = "$router.push('/device/storage')">返回</el-button>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <div class="home-figure show-data">
                            <el-row :gutter="10" style="margin: 20px 0">
                                <el-col :sm="4" v-for="(ele,i) in showList" :key="i">
                                    <div class="grid-content">
                                        <div class="home-figure-content">{{ele.label}}</div>
                                        <div class="home-figure-num">{{ele.num}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <!--  <el-table-column type="selection">
                                  </el-table-column>-->
                                <el-table-column prop="device_no" label="设备SN">
                                </el-table-column>
                                <el-table-column prop="device_name" label="设备名称">
                                </el-table-column>
                                <el-table-column prop="device_type_name" label="设备分类">
                                </el-table-column>
                                <el-table-column prop="mer_name" label="商户名">
                                    <template slot-scope="scope">
                                        <p>{{ scope.row.mer_name ? scope.row.mer_name : '--' }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="推荐人">
                                    <template slot-scope="scope">
                                        <p>{{ scope.row.agent_name ? scope.row.agent_name : '--' }}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="str_status" label="状态">
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
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Detail",
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data(){
            return {
                //1：入库，2：出库（分配给代理商），3：分配给商户，4：分配给门店，5：回收（代理退给总后台），6：退回（商户退给代理商）
                mapStatus: {1: '已入库(总后台)', 2: '已入库(代理商)',3: '已绑定',4: '已绑定(门店)',5: '回收(总后台)',6: '退回(代理商)',7:'已入库(分销商)',8:'已退回(分销商)'},
                searchState: false,
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
                    "order_no": '',
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                },
                showList: [
                    {
                        label: '总数',
                        num: 0
                    },
                    {
                        label: '库存数',
                        num: 0
                    },
                    {
                        label: '已绑定数',
                        num: 0
                    }
                ],
                tableData: []
            }
        },
        methods: {
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.postData.cursor = val;
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
            /**
             * 获取列表数据
             */
            getData() {
                //初始化列表
                this.$axios.post('/admin/devices/order/detail/list', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.tableData.forEach(ele => {
                            ele.create_time = new Date(ele.create_time).format('yyyy-MM-dd hh:mm:ss');
                        });
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    } else {
                        this.$message(res.data.message);
                    }
                    this.searchState = false;
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            /**
             * 获取顶部数据统计
             */
            getDetail() {
                //初始化列表
                this.$axios.get('/admin/devices/order/detail/top?order_no=' + this.postData.order_no).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.showList[0].num = res.data.data.device_count;
                        this.showList[1].num = res.data.data.stock_count;
                        this.showList[2].num = res.data.data.use_count;
                    } else {
                        this.$message(res.data.message);
                    }
                    this.searchState = false;
                })
                    .catch(() => {
                        this.searchState = false;
                    });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        beforeMount() {
            if(this.$route.query.orderNo){
                this.postData.order_no = this.$route.query.orderNo;
            }

            // 获取列表数据
            this.getData();
            // 获取顶部数据统计
            this.getDetail();
        },
    }
</script>

<style scoped>
    .el-date-editor--datetimerange {
        width: 240px!important;
        margin-top: 4px;
    }
</style>