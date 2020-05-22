<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <div class="third-nav-t">支付后广告管理</div>
            </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <!-- 搜索条件 start -->
                        <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline">
                            <el-form-item label="服务商名称">
                                <el-input v-model="postData.agent_name" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="广告名称">
                                <el-input v-model="postData.ad_name" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="投放时间">
                                <!--:default-time="['12:00:00']"-->
                                <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="投放状态">
                                <el-select v-model="postData.status" placeholder="投放状态" clearable>
                                    <el-option v-for="item in adStatus"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit" size="small" v-loading="searchState">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <!-- 搜索条件 end -->

                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column type="index" fixed label="序号" width="50" :key="1">
                                    <template slot-scope="scope">{{ ((pagination.currentPage -1) *
                                        pagination.pageSize) + (scope.$index + 1) }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="服务商" :key="2">
                                </el-table-column>
                                <el-table-column prop="ad_name" label="广告名称" :key="3">
                                </el-table-column>
                                <el-table-column prop="start_time" label="开始时间" :key="4">
                                </el-table-column>
                                <el-table-column prop="end_time" label="结束时间" :key="5">
                                </el-table-column>
                                <el-table-column prop="redirect" label="是否跳转" :key="6">
                                    <template slot-scope="scope">
                                        <p>{{mapRedirect[scope.row.redirect]}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="device_count" label="投放设备数" :key="7">
                                </el-table-column>
                                <el-table-column prop="img_url_pv_count" label="跳转前曝光量" :key="8">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.img_url_pv_count ? scope.row.img_url_pv_count : '--'}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="img_h5_url_pv_count" label="跳转后曝光量" :key="9">
                                    <template slot-scope="scope">
                                        <p>{{scope.row.img_h5_url_pv_count ? scope.row.img_h5_url_pv_count : '--'}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="status" label="投放状态" :key="10">
                                    <template slot-scope="scope">
                                        <p>{{mapStatus[scope.row.status]}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" min-width='115' :key="11">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="detailClick(scope.row)">详情</el-button>
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
        name: "list",
        components: {
            // second_nav,
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data: function () {
            return {
                mapRedirect:{0:'不跳转',1:'跳转',undefined:'--',null:'--'},
                mapStatus:{0:'已结束',1:'投放中',2:'待生效',undefined:'--',null:'--'},
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
                    "ad_type": 2,//支付前1，支付后2
                    "ad_name": '',
                    "agent_name": '',
                    "start_time": '',
                    "end_time": '',
                    "status": '',
                    "date": '',
                },
                tabIndex: '2',//tab选中值
                tabList: [
                    {
                        value: '1',
                        label: '支付前广告'
                    },
                    {
                        value: '2',
                        label: '支付后广告'
                    }
                ],
                adStatus: [
                    {
                        value: '0',
                        label: '已结束'
                    },
                    {
                        value: '1',
                        label: '投放中'
                    },
                    {
                        value: '2',
                        label: '待生效'
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
                if(val){
                    let start = new Date(val[0]),end = new Date(val[1]);
                    console.log(start,end);
                    this.postData.start_time = start.valueOf();
                    this.postData.end_time = end.valueOf();
                    console.log()
                }else {
                    this.postData.start_time = this.postData.end_time = '';
                }
                console.log(this.postData)
            },
            /**
             * tab选择
             * @param key
             * @param keyPath
             */
            tabSelect(key, keyPath) {
                this.tabIndex = this.postData.ad_type = key;
                console.log(key, keyPath,this.tabIndex);
                this.pagination.currentPage = this.postData.cursor = 1;
                this.postData.size = 10;
                this.postData.start_time = this.postData.end_time = this.postData.ad_name = this.postData.poster_name = this.postData.status = this.postData.date = '';
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
             * 获取列表数据
             */
            getData() {
                //初始化列表
                this.$axios.post('/admin/advertising/ad/list', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
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
             * 查询
             */
            onSubmit() {
                console.log('submit!');
                this.searchState = true;
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            /**
             * 删除
             */
            offClick(val) {
                console.log(val);
                let text = '关闭';
                this.$confirm(text+'该广告, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/agent/Advertising/ad/close', {
                        "id": val.ad_id
                    }).then(res => {
                        console.log(res);
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.$message({
                                type: 'success',
                                message: text + '成功!'
                            });
                            this.getData();
                        } else {
                            this.$message(res.data.message);
                        }
                    })
                        .catch(() => {

                        });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + text
                    });
                });
            },
            /**
             * 详情
             */
            detailClick(val) {
                console.log(val);
                this.$router.push({path: '/ad/detail', query: {adId: val.ad_id,type:this.tabIndex}})
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
        },
        created(){

        },
        beforeMount() {
            // 获取列表数据
            this.getData();
        },
    }
</script>


<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
    .colorStyle {
        color: red;
    }
</style>
