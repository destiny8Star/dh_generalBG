<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <div class="third-nav-t">商户管理</div>
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
                                        <div class="home-figure-content">{{ele.id}}</div>
                                        <div class="home-figure-num">{{ele.value}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
						 <!--搜索条件 start -->
                        <!--搜索条件 start -->
                        <el-form :inline="true" :model="postData" class="demo-form-inline">
                            <el-row>
                                <el-form-item label="日期">
                                    <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期" format="yyyy-MM-dd">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="商户名">
                                    <el-input v-model="postData.store_name"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号">
                                    <el-input v-model="postData.tel"></el-input>
                                </el-form-item>
                                <el-form-item label="推荐人(身份)">
                                <!--<el-form-item label="所属服务商">-->
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
                                <el-table-column prop="store_name" label="商户名">
                                </el-table-column>
                                <el-table-column prop="real_name" label="姓名">
                                </el-table-column>
                                <el-table-column prop="tel" label="手机号">
                                </el-table-column>
                                <el-table-column prop="area" label="所属区域">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.area||'--'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="推荐人(身份)">
                                <!--<el-table-column prop="agent_name" label="所属服务商">-->
                                    <template slot-scope="scope">
                                        <div>{{scope.row.agent_name||'--'}} / {{scope.row.sub_agent_name||'--'}}</div>
                                    </template>
                                </el-table-column>
                               <!-- <el-table-column prop="sub_agent_name" label="推荐人(身份)">
                                &lt;!&ndash;<el-table-column prop="sub_agent_name" label="所属分销商">&ndash;&gt;
                                    <template slot-scope="scope">
                                        <div>{{scope.row.sub_agent_name||'&#45;&#45;'}}</div>
                                    </template>
                                </el-table-column>-->
                                <el-table-column prop="update_time" label="开户时间">
                                    <template slot-scope="scope">
                                        <div>{{new Date(scope.row.update_time).format('yyyy-MM-dd hh:mm:ss')}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="pay_channel_type" label="收款通道">
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
    import CommonFooter from '../../components/CommonFooter.vue'
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
                        label: '分销商总数',
                        num: 3
                    },
                    {
                        label: '启用中',
                        num: 346
                    },
                    {
                        label: '已禁用',
                        num: 78
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
                    "agent_name": "",//所属服务商---推荐人(身份)
                    "status": 1,//1审核成功,3审核中
                    "store_name": "",//商户名
                    "tel": "",
                    "start_time": '',
                    "end_time": '',
                    "date": ''
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
                // this.multipleSelection = val;
            },
            //
            handleClick(data) {
                console.log(data);
                data.pay_channel_type = map[data.pay_channel_type];
                this.$router.push({path:'/merchant/detail',query:{merchantId:data.id,status:data.pay_channel_type}})
            },
            onSubmit() {
                console.log('submit!');
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            //获取topdata
            getTop(){
                this.$axios.post('/admin/store/top/data')
                        .then(res=>{
                            if(res.data.code === this.$webConfig.httpSuccessStatus){
                                this.showList = res.data.data
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
                this.$axios.post('/admin/store/list', this.postData).then(res => {
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
    .main-inner {
        padding: 13px 40px;
    }

    .boxMess {
        max-height: 80px;
        overflow-y: scroll
    }

    /* .boxMess::-webkit-scrollbar {
        display: none;
    } */
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }

</style>
