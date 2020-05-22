<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <el-menu :default-active="tabIndex" class="el-menu-demo" mode="horizontal" @select="tabSelect">
                    <el-menu-item v-for="(ele,i) in tabList" :key="i" :index="ele.value">{{ele.label}}（{{ele.num}}个）</el-menu-item>
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
                                <el-form-item label="商户名">
                                    <el-input v-model="postData.store_name"></el-input>
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
                               <!-- <el-table-column
                                        type="selection"
                                        width="55">
                                </el-table-column>-->
                                <el-table-column prop="create_time" label="申请时间">
                                     <template slot-scope="scope">
                                        <div>{{new Date(scope.row.create_time).format('yyyy-MM-dd hh:mm:ss')}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="store_name" label="商户名">
                                </el-table-column>
                                <el-table-column prop="real_name" label="姓名">
                                </el-table-column>
                                <el-table-column prop="tel" label="手机号">
                                </el-table-column>
                                <el-table-column prop="area" label="所属区域">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.area}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="推荐人(身份)">
                                <!--<el-table-column prop="agent_name" label="所属服务商/分销商">-->
                                    <template slot-scope="scope">
                                        <div>{{scope.row.agent_name}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="audit_result" label="驳回原因" v-if='postData.status==2'>
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text">详情
                                        </el-button>
                                        <el-button v-if="tabIndex==2" @click="delClick(scope.row)" style="color:red" type="text">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                        <el-row style="margin-top: 30px;">
                            <el-button size="medium" @click="derivedData" >导出商户资料</el-button>
                        </el-row>
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
                selectionList : [],
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
                    "status": '3',//1审核成功,3审核中
                    "type": 1,//1微信,2支付宝
                    "store_name": "",//商户名
                    'agent_name':'', //所属分销商
                    "start_time": '',
                    "end_time": '',
                    'date':''
                },
                tabIndex: '3',//tab选中值
                tabList: [
                    {
                        value: '3',
                        label: '待审核',
                        num: 1
                    },
                    {
                        value: '2',
                        label: '驳回',
                        num: 3
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
                this.selectionList = val;
                console.log(val,this.selectionList);
            },
            //查看详情
            handleClick(data) {
                console.log(data);
                this.$router.push({path:'/merchant/weChatDetail',query:{merchantId:data.id,status:this.postData.status}})
            },
            /**
             * 删除
             */
            delClick(data) {
                console.log(data);
                this.$confirm('确定删除此记录吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/admin/store/del',{"id":data.id})
                        .then(res=>{
                            console.log(res);
                            if(res.data.code==this.$webConfig.httpSuccessStatus){
                                this.$message({type: 'success', message: '删除成功!'});
                                this.getTop();
                                this.getData()
                            }else{
                                this.$message.error(res.data.message)
                            }
                        })
                        .catch(rej=>{
                            this.$message.error('网络异常')
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            onSubmit() {
                console.log('submit!');
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData();
            },
            //选择顶部tab
            tabSelect(key, keyPath){
                console.log(key, keyPath);
                this.tabIndex=key
                this.postData.status=key
                this.pagination.currentPage = this.postData.cursor = 1;
                 this.getData()
            },
            //获取待审核和驳回数据
            getTop(){
                this.$axios.post('/admin/store/no',{"type":1})
                        .then(res=>{
                            console.log("获取统计",res)
                            if(res.data.code==this.$webConfig.httpSuccessStatus){
                                this.tabList[0].num=res.data.data.unrevised_no
                                this.tabList[1].num=res.data.data.refused_no
                            }else{
                            this.$message.error(res.data.message)
                            }
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

<style scoped>
    .el-date-editor--datetimerange {
        width: 230px!important;
        margin-top: 4px;
    }
    .main-inner {
        padding: 13px 40px;
    }
</style>
