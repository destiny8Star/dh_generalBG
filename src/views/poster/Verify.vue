<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <el-menu :default-active="tabIndex" class="el-menu-demo" mode="horizontal" @select="tabSelect">
                    <el-menu-item v-for="(ele,i) in tabList" :key="i" :index="ele.value">{{ele.label}}
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
                                <el-form-item label="创建时间">
                                    <!--:default-time="['12:00:00']"-->
                                    <el-date-picker @change="changeDate" v-model="postData.date" type="datetimerange"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期" format="yyyy-MM-dd" clearable>
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="广告名称">
                                    <el-input v-model="postData.poster_name" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="代理商">
                                    <el-input v-model="postData.agent_name" clearable></el-input>
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
                                <el-table-column prop="create_time" label="创建时间" :key="1">
                                    <template slot-scope="scope">
                                        <div>{{new Date(scope.row.create_time).format('yyyy-MM-dd hh:mm:ss')}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="poster_name" label="图片名称" :key="2">
                                </el-table-column>
                                <!-- //支付后广告展示 -->
                                <template v-if="postData.ad_type == 2">
                                    <el-table-column prop="is_redirect" label="是否跳转" :key="3">
                                        <template slot-scope="scope">
                                            {{scope.row.is_redirect == 1?'是':'否'}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="poster_url" label="跳转前图片" :key="4">
                                        <template slot-scope="scope">
                                            <img :src="scope.row.poster_url" style="max-width:100px;height:auto;max-height:100px">
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="poster_h5_url" label="跳转后图片" :key="5">
                                        <template slot-scope="scope">
                                            <img :src="scope.row.poster_h5_url" style="max-width:100px;height:auto;max-height:100px" v-if="scope.row.poster_h5_url">
                                            <span v-if="!scope.row.poster_h5_url">--</span>
                                        </template>
                                    </el-table-column>
                                </template>    
                                <!-- //支付后广告展示end -->
                                 <el-table-column prop="poster_url" label="图片" v-if="postData.ad_type == 1" :key="6">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.poster_url" style="max-width:100px;height:auto;max-height:100px">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="代理商" :key="7">
                                </el-table-column>
                                <template v-if="postData.status == 1">
                                    <el-table-column prop="agent_name" label="拒绝理由" :key="8">
                                        <template slot-scope="scope">
                                            {{scope.row.reason ? scope.row.reason : "--"}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column fixed="right" label="审核结果">
                                        <template slot-scope="scope">
                                            {{scope.row.status == 1 ? "已通过" : "已拒绝"}}
                                        </template>
                                    </el-table-column>
                                </template>
                                <el-table-column fixed="right" label="操作" :key="9" v-if="postData.status == 0">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row,1)" type="text">通过</el-button>
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

                        <!-- //弹出框 拒绝框-->
                     <el-dialog
                        title="拒绝理由"
                        :visible.sync="centerDialogVisible"
                        :close-on-click-modal='false'	
                        :show-close='false'
                        :close-on-press-escape='false'
                        width="30%"
                        center>
                        <el-select v-model="reason" placeholder="请选择" style="width:100%" clearable>
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.label">
                            </el-option>
                        </el-select>
                        <el-input v-model="reason" placeholder="请输入其他" style="margin:20px 0"  type="textarea" clearable></el-input>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="centerDialogVisible = false,reason = '',rejId=''">取 消</el-button>
                            <el-button type="primary" @click="toDis" >确 定</el-button>
                        </span>
                    </el-dialog>
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
                selectionList: [],//表格选定--没用
                centerDialogVisible:false, //弹框显示否
                rejId:'',//当前拒绝的poster_id
                options:[//拒绝理由
                    {
                    value: '1',
                    label: '反对宪法所确定的基本原则的行为'
                    },
                     {
                    value: '2',
                    label: '危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的行为'
                    },
                     {
                    value: '3',
                    label: '损害国家荣誉和利益的行为'
                    },
                     {
                    value: '4',
                    label: '煽动民族仇恨、民族歧视，破坏民族团结的行为'
                    },
                     {
                    value: '5',
                    label: '破坏国家宗教政策，宣扬邪教和封建迷信的行为'
                    },
                     {
                    value: '6',
                    label: '散布谣言，扰乱社会秩序，破坏社会稳定的行为'
                    },
                     {
                    value: '7',
                    label: '散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的行为'
                    },
                     {
                    value: '8',
                    label: '侮辱或者诽谤他人，侵害他人合法权益的行为'
                    },
                     {
                    value: '9',
                    label: '侵害他人知识产权、商业秘密、肖像权、名誉权等合法权利的行为'
                    },
                     {
                    value: '10',
                    label: '恶意虚构事实、隐瞒真相以误导、欺骗他人的行为'
                    },
                     {
                    value: '11',
                    label: '发布、传送、传播不良信息及垃圾信息'
                    },
                     {
                    value: '12',
                    label: '诋毁支付宝、支付宝的关联主体、及其相关产品形象的信息'
                    },
                     {
                    value: '13',
                    label: '攻击第三方及其产品的不正当竞争行为的信息'
                    },
                    {
                    value: '14',
                    label: '其他我们认为不适当在支付宝盒上发布的信息'
                    },
                    {
                    value: '15',
                    label: '其他法律法规禁止的行为'
                    },
                ], 
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
                    "ad_type": '1',//海报类型 1支付前海报，2支付后海报
                    "status":'0',//审核状态 0待审核，1审核通过，2拒绝
                    "agent_name": "",//代理商
                    "start_time": '',
                    "end_time": '',
                    "poster_name":'', //海报名称
                    'date': ''
                },
                reason:'', //传给后台的reson
                tabIndex: '0',//tab选中值
                tabList: [
                    {
                        value: '0',
                        label: '待审核(支付前广告)',
                        num: 1
                    },
                    {
                        value: '1',
                        label: '待审核(支付后广告)',
                        num: 3
                    },
                    {
                        value: '2',
                        label: '已审核(支付前广告)',
                        num: 3
                    },
                    {
                        value: '3',
                        label: '已审核(支付后广告)',
                        num: 3
                    },
                ],
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
                this.selectionList = val;
                console.log(val, this.selectionList);
            },
            //拒绝
            toDis(){
              console.log('fx',this.rejId,this.reason)
              let reg = /\S/
              if(!reg.test(this.reason)){
                  return this.$message.warning("请选择或输入内容!")
              }
              let dataObj = {
                    "reason": this.reason,
                    "audit": 0,
                    "poster_id":this.rejId
                };
              this.$axios.post('/admin/advertising/poster/audit',dataObj)
                .then(res => {
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.$message.success('拒绝成功');
                        this.centerDialogVisible = false
                        this.rejId = this.reason = ''
                        this.getData()
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
                .catch(rej => {
                    this.$message.error('网络异常!');
                    console.log('失败', rej)
                })
            },
            //点击按钮
            handleClick(data,num) {
                console.log(data,num);
                if(num==1){
                    this.agreeClick(data,num);
                }else if (num==2){
                    this.centerDialogVisible = true
                    this.rejId = data.poster_id
                }
            },
   
            /**
             * 同意
             */
            agreeClick(ele,n){
                this.$confirm('此操作将通过审核, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let dataObj = {
                        "reason": '',
                        "audit": 1,
                        "poster_id": ele.poster_id
                    };
                    this.$axios.post('/admin/advertising/poster/audit', dataObj).then(res => {
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
                switch(key){
                  case "0":
                     this.postData.ad_type = 1 ;this.postData.status = 0;
                     break;
                  case "1":
                     this.postData.ad_type = 2 ;this.postData.status = 0;
                     break;
                  case "2":
                     this.postData.ad_type = 1 ;this.postData.status = 1;
                     break;
                  case "3":
                     this.postData.ad_type = 2 ;this.postData.status = 1;
                     break;         
                }
                this.pagination.currentPage = this.postData.cursor = 1;
                this.getData()
            },
       
            //获取数据
            getData() {
                this.loading = true;
                //初始化列表
                this.$axios.post('/admin/advertising/poster/list', this.postData).then(res => {
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
