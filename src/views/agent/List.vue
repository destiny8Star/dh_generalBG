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

                        <!-- top数据展示 start -->
                       <!-- <div class="home-figure show-data">
                            <el-row :gutter="10" style="margin: 0 0 20px">
                                <el-col :sm="4" v-for="(ele,i) in showList" :key="i">
                                    <div class="grid-content">
                                        <div class="home-figure-content">{{ele.agent_level_index_name}}</div>
                                        <div class="home-figure-num">{{ele.count}}</div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>-->
                        <div class="home-figure show-data">
                            <el-row :gutter="10" style="margin: 0 0 20px">
                                <el-col :sm="4" v-for="(ele,i) in showList" :key="i">
                                    <div class="grid-content">
                                        <div class="home-figure-content">{{ele.agent_level_index_name}}</div>
                                        <div class="ly-show-data">
                                            <span>今日新增数</span><span style="color: #409EFF">{{ele.today_agent_count}}</span>
                                        </div>
                                        <div class="ly-show-data">
                                            <span>总数</span><span style="color: #409EFF">{{ele.total_agent_count}}</span>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <!-- top数据展示 end -->

                        <!-- 搜索条件 start -->
                        <el-form :inline="true" ref="postData" :model="postData" class="demo-form-inline" style="margin-top: 40px">
                            <el-form-item label="公司名">
                                <el-input v-model="postData.name" placeholder="请输入公司名" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="姓名">
                                <el-input v-model="postData.real_name" placeholder="请输入姓名" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="手机号">
                                <el-input v-model="postData.agent_service_tel" placeholder="请输入手机号" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="等级">
                                <el-select v-model="postData.agent_level_index" placeholder="请选择等级" clearable>
                                    <el-option v-for="item in levelList"
                                               :key="item.level"
                                               :label="item.desc"
                                               :value="item.level"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="区域">
                                <!--v-loading="classLoading"-->
                                <el-cascader
                                        clearable
                                        placeholder="请选择区域"
                                        :options="goodsTypeList"
                                        v-model="selectedGood"
                                        :props = "classifyProp"
                                        separator = "  "
                                        change-on-select
                                        @change="goodChange">
                                </el-cascader>
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
                               <!-- <el-table-column type="index" fixed width="80" label="编号">
                                    <template slot-scope="scope">{{ ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1)}}
                                    </template>
                                </el-table-column>-->
                                <!-- <el-table-column prop="agent_no" label="编号">
                                 </el-table-column>-->
                                <el-table-column prop="name" label="公司名">
                                </el-table-column>
                                <el-table-column prop="real_name" label="姓名">
                                </el-table-column>
                                <el-table-column prop="agent_service_tel" label="手机号">
                                </el-table-column>
                                <el-table-column prop="agent_level_index" label="等级">
                                </el-table-column>
                                <el-table-column prop="agent_area" label="所属区域">
                                    <template slot-scope="scope">
                                        {{scope.row.agent_area ? scope.row.agent_area : '--'}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="referee_tel" label="邀请人">
                                    <template slot-scope="scope">
                                        {{scope.row.referee_tel ? scope.row.referee_tel : '--'}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="create_time" label="合作时间">
                                </el-table-column>
                                <el-table-column prop="payment_amount" label="缴纳金额(元)">
                                </el-table-column>
                                <!--<el-table-column prop="level_desc" label="直邀人数">
                                </el-table-column>
                                <el-table-column prop="level_desc" label="区域人数">
                                </el-table-column>-->
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
    const map = {1:'',2:'', 3:'', 4:''};//等级
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
        data() {
            return {
                /* 区域选择器 */
                //区域联动选择器的配置--用来将后台获取的数据绑定在联动选择器上
                "classifyProp": {value: 'id', label: 'value', children: 'categoryResps'},
                "nextClassifyId": '1',//获取下一级区域的id
                "goodsTypeList": [],//商品所有城市
                "selectedGood": [],//商品分类id数组["一级城市id","二级城市id","三级城市id"]
                "classLoading": true,//城市加载

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
                    "real_name": '',
                    "agent_service_tel": '',
                    "agent_level_index": '',
                    "province_code": '',
                    "city_code": '',
                    "area_code": '',
                },
                showList: [
                   /* {
                        agent_level_index_name: '城市服务商',
                        today_agent_count: 0,
                        total_agent_count: 0
                    },
                    {
                        agent_level_index_name: '城市服务商',
                        today_agent_count: 0,
                        total_agent_count: 0
                    },
                    {
                        agent_level_index_name: '区域服务商',
                        today_agent_count: 0,
                        total_agent_count: 0
                    }*/
                ],
                levelList: [
                    /*{
                        desc: '1',
                        level: '城市服务商'
                    },
                    {
                        desc: '2',
                        level: '区域服务商'
                    },
                    {
                        desc: '3',
                        level: '执行服务商'
                    },
                    {
                        desc: '4',
                        level: '分销商'
                    }*/
                ],
                relationState: [
                    {
                        value: '1',
                        label: '直推'
                    },
                    {
                        value: '2',
                        label: '间推'
                    }
                ],
                tableData: [
                    {
                        id: 1,
                    }
                ],
            }
        },
        methods: {
            /**
             *  查看详情
             */
            handleClick(data) {
                console.log(data);
                this.$router.push({path:'/agent/detail',query:{agentId:data.id}})
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
             * 获取等级list
             */
            getLevelData() {
                //初始化列表
                this.$axios.post('/admin/sys/getLevel').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.levelList = res.data.data;
                        this.levelList.forEach(ele=>{
                            console.log(ele);
                            map[ele.level] = ele.desc;
                        })
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
                this.$axios.post('/admin/agent/agentList', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.tableData.forEach(ele=>{
                            ele.agent_level_index = map[ele.agent_level_index];
                            console.log(ele.agent_level_index);
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
                this.$axios.post('/admin/agent/agentTopData',this.form).then(res => {
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
            },
            /**
             * 区域选择 - 逐级获取城市
             * @param value
             */
            goodChange(value) {
                this.classLoading = true;
                console.log(value,this.selectedGood);
                this.postData.province_code = this.postData.city_code = this.postData.area_code = '';
                if(value.length==0){
                    this.classLoading = false;
                }
                if(value.length==1){
                    this.nextClassifyId = value[0];
                    this.postData.province_code = value[0];
                    this.getCity()
                }
                if(value.length==2){
                    this.nextClassifyId = value[1];
                    this.postData.city_code = value[1];
                    this.getCity()
                }
                if(value.length==3){
                    this.classLoading = false;
                    this.postData.area_code = value[2];
                }
            },
            // 获取城市
            getCity(){
                this.$axios.get('/admin/city/province?areaParentId='+this.nextClassifyId).then(res=>{
                    console.log(res);
                    this.classLoading = false;
                    if( res.data.code === this.$webConfig.httpSuccessStatus){
                        if(this.nextClassifyId == 1){
                            this.goodsTypeList = res.data.data;
                            this.goodsTypeList.forEach(ele=>{
                                this.$set(ele,'categoryResps',[])
                            });
                            console.log(this.goodsTypeList)
                        }
                        if(this.selectedGood.length==1){
                            res.data.data.forEach(val=>{
                                this.$set(val,'categoryResps',[])
                            });
                            this.goodsTypeList.forEach(ele=>{
                                if(ele.id == this.selectedGood[0]) {
                                    this.$set(ele,'categoryResps',res.data.data);
                                }
                            });
                            console.log(this.goodsTypeList);
                        }
                        if(this.selectedGood.length==2){
                            this.goodsTypeList.forEach(ele=>{
                                ele.categoryResps.forEach(val=>{
                                    if(val.id == this.selectedGood[1]) {
                                        this.$set(val,'categoryResps',res.data.data);
                                    }
                                });
                            });
                            console.log(this.goodsTypeList);
                        }
                        console.log(this.goodsTypeList);
                        if(this.selectedGood.length==2){

                        }
                    }else if(res.data.code == 100070 || res.data.code == 404){
                        this.$message.warning(res.message);
                        this.$router.push('/')
                    }else {
                        this.$message.warning(res.message);
                    }
                })
            },
        },
        beforeMount() {
            //    获取等级list
            this.getLevelData();
            // 获取列表数据
            this.getData();
            this.getShowData();
            // 获取区域
            this.getCity();
        },
    }
</script>


<style scoped>
    .el-date-editor--datetimerange {
        width: 230px !important;
        margin-top: 4px;
    }
    .home-figure-content {
        font-size: 16px;
    }
    .home-figure .grid-content {
        height: auto;
    }
    .ly-show-data {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        color: #8590A9
    }
</style>
