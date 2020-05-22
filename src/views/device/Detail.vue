<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div style="display: flex;align-items: center;justify-content: space-between">
                <div class="third-nav-t">设备详情</div>
                <el-button style="margin: 0 30px" size="small" type="primary" @click = "$router.push('/device')">返回</el-button>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <div class="home-title">
                            <span class="home-title-t ly-title">基本信息</span>
                        </div>
                        <div class="realBox">
                            <div style="margin-right: 30px">
                                <p v-for="(ele,i) in infoData" :key="i">{{ele.table}}：<span>{{ele.value}}</span></p>
                            </div>
                            <img :src="deviceImg" alt="">
                        </div>
                        <div class="home-title" style="margin: 10px 0">
                            <span class="home-title-t ly-title">设备流转信息</span>
                        </div>

                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <!--  <el-table-column type="selection">
                                  </el-table-column>-->
                                <el-table-column prop="operation_time" label="操作时间">
                                </el-table-column>
                                <el-table-column prop="operation" label="操作说明">
                                </el-table-column>
                                <el-table-column prop="device_site" label="位置">
                                </el-table-column>
                                <el-table-column prop="str_status" label="状态说明">
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
                mapStatus: {1: '已入库(总后台)', 2: '已入库(代理商)',3: '已绑定',4: '已绑定(门店)',5: '回收(总后台)',6: '退回(代理商)',7:'已入库(分销商)',8:'已退回(分销商)'},
                mapType: {1: '入库', 2: '出库',3: '绑定',4: '绑定',5: '解绑',6: '解绑',7: '已分配',8: '已退回'},
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
                    "device_no": '',
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                },
                deviceImg: '',//设备图片
                infoData: [
                    {
                        table: '设备名称',
                        value: ''
                    },
                    {
                        table: '设备分类',
                        value: ''
                    },
                    {
                        table: '设备SN',
                        value: ''
                    },
                   /* {
                        table: '设备厂商',
                        value: '46878787878787878787967'
                    },*/
                    {
                        table: '设备状态',
                        value: ''
                    },
                    {
                        table: '设备位置',
                        value: ''
                    },
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
                this.$axios.post('/admin/devices/history/list', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
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
             * 获取信息详情
             */
            getDetail() {
                //初始化列表
                this.$axios.get('/admin/devices/detail?device_no=' + this.postData.device_no).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let info = res.data.data;
                        this.deviceImg = info.pic;
                        this.infoData[0].value = info.device_name || '--';
                        this.infoData[1].value = info.device_type || '--';
                        this.infoData[2].value = info.device_no || '--';
                        // this.infoData[3].value = info.phone || '--';
                        this.infoData[3].value = this.mapStatus[info.status];
                        this.infoData[4].value = info.device_site || '--';
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
            if(this.$route.query.deviceNo){
                this.postData.device_no = this.$route.query.deviceNo;
            }

            // 获取列表数据
            this.getData();
            // 获取信息
            this.getDetail();
        },
    }
</script>

<style scoped>
    .el-date-editor--datetimerange {
        width: 240px!important;
        margin-top: 4px;
    }
    .realBox {
        width: 40%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
        border-radius: 4px;
        /*padding: 15px 60px 15px 30px;*/
        margin: 15px 0;
        padding: 0 60px 0 20px;
    }
    .realBox img{
        width: 200px;
        height: 200px;
        padding: 20px;
        margin: 14px 50px;
        /*border-radius: 4px;*/
        /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
    }
    .realBox p{
        /*font-size: 16px;*/
        line-height: 32px;
    }
    .realBox span{
        margin-left: 10px;
    }
</style>
