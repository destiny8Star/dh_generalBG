<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav">
                <div class="third-nav-t">设备管理</div>
            </div>
            <!-- tab按钮 end -->
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" v-loading="loading">
                        <!-- top数据展示 start -->
                        <div class="home-figure show-data">
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
                        <el-form :inline="true" :model="postData" class="demo-form-inline" ref="postData"
                                 :rules="rules">
                            <el-row>
                                <el-form-item label="设备SN码">
                                    <el-input v-model="postData.device_no" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="所属代理商" prop="agent_name">
                                    <el-input v-model="postData.agent_name" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="所属商户">
                                    <el-input v-model="postData.mer_name" placeholder="请输入"></el-input>
                                </el-form-item>
                                <el-form-item label="设备状态">
                                    <el-select v-model="postData.status" placeholder="请选择" clearable>
                                        <el-option v-for="item in statusList"
                                                   :key="item.id"
                                                   :label="item.value"
                                                   :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="设备名称">
                                    <el-select v-model="postData.device_name_id" placeholder="请选择" clearable>
                                        <el-option v-for="item in deviceNameList"
                                                   :key="item.device_name_id"
                                                   :label="item.device_name"
                                                   :value="item.device_name_id"></el-option>
                                    </el-select>

                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmit" size="small">
                                        查询
                                    </el-button>
                                </el-form-item>
                                <el-form-item>
                                    <el-button size="small" type="primary" @click="recycleBtn('postData')"
                                               v-loading="recycleState">批量回收
                                    </el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                        <!--搜索条件 end -->
                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange" @toggleRowSelection="toggleRowSelection"
                                      :row-key="getRowKeys">
                                <el-table-column
                                        type="selection"
                                        :selectable='selectInit'
                                        width="55">
                                </el-table-column>
                                <el-table-column prop="device_no" label="设备SN">
                                </el-table-column>
                                <el-table-column prop="device_name" label="设备名称">
                                </el-table-column>
                                <el-table-column prop="mer_name" label="商户名">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.mer_name||'--'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="agent_name" label="代理商">
                                    <template slot-scope="scope">
                                        <div>{{scope.row.agent_name||'--'}}</div>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="str_status" label="状态">
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                    <template slot-scope="scope">
                                        <el-button @click="handleClick(scope.row)" type="text" size="small">详情
                                        </el-button>
                                        <el-button @click="recycleClick(scope.row)" :disabled="scope.row.status != 2 && scope.row.status != 6 && scope.row.status != 9" type="text" size="small">回收
                                        </el-button>
                                        <el-button @click="delClick(scope.row)" :class="{redColor : (scope.row.status == 1 || scope.row.status == 5)}" :disabled="scope.row.status != 1 && scope.row.status != 5" type="text" size="small">删除
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

    let map = {1: '直连', 2: '间连', '直连': 1, '间连': 2};
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
            var checkNullText = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            return {
                // 获取row的key值
                getRowKeys(row) {
                    return row.device_no;
                },
                loading: false,
                recycleState: false,
                submitState: false,
                showList: [
                    {
                        label: '总数',
                        value: 0
                    },
                    {
                        label: '库存数',
                        value: 0
                    },
                    {
                        label: '已绑定数',
                        value: 0
                    }
                ],
                mapStatus: {
                    1: '已入库(总后台)',
                    2: '已入库(代理商)',
                    3: '已绑定',
                    4: '已绑定(门店)',
                    5: '回收(总后台)',
                    6: '已退回(代理商)',
                    7: '已入库(分销商)',
                    8: '已退回(分销商)'
                },
                statusList: [],
                tableData: [],
                winHeight: window.innerHeight,
                //页面所需
                "pagination": {
                    "total": 0,
                    "pageCount": [2, 10, 20, 50, 100],
                    "currentPage": 1,
                    "pageSize": 10,
                    "show": '1-5'
                },
                //接口参数
                "postData": {
                    "cursor": 1,//当前第几页-游标
                    "size": 10,//每页条数
                    "device_no": "",//设备SN
                    "agent_name": "",//代理商名称
                    "status": '',//1：入总库，2：分配给代理、3：分配给商户，4：绑订到门店，5回收
                    "mer_name": "",//商户名
                    "device_name_id": "",//设备名
                },
                rules: {
                    agent_name: [
                        {
                            validator: checkNullText,
                            required: true,
                            message: '请输入服务商名称',
                            trigger: 'blur'
                        }
                    ],
                },
                multipleSelection: [],
                multipleSelectionId: {},
                device_nos: [],//批量回收，list
                deviceNameList: [],//选择器-设备名称
            }
        },
        methods: {
            /**
             *  判断是否可回收
             */
            selectInit(row, index) {
                if (row.status == 2 || row.status == 6 || row.status == 9) {
                    return true; //可勾选
                }else {
                    return false//不可勾选
                }
            },
            /**
             * 构建当前页的选中Ids
             */
            buildCurrIds() {
                this.multipleSelectionId[this.pagination.currentPage] = [];
                this.multipleSelection.forEach((ele, i) => {
                    this.multipleSelectionId[this.pagination.currentPage].push(ele.device_no);
                });
            },
            /**
             * 构建选中需要提交的Ids
             */
            buildSubmitIds() {
                this.device_nos = [];
                this.buildCurrIds();
                for (let key in this.multipleSelectionId) {
                    this.device_nos = this.device_nos.concat(this.multipleSelectionId[key]);
                }
            },
            /**
             * 清空选择，用于搜索后，改变每页条数后
             */
            clearSelIds() {
                this.multipleSelection = [];
                this.multipleSelectionId = {};
                this.device_nos = [];
                this.$refs.multipleTable.clearSelection();
            },
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                /*翻页前记录当前页的选中状态*/
                this.buildCurrIds();
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getData();
            },
            /**
             * 上一页
             */
            prevClick() {
                /*this.pagination.currentPage--;
                this.postData.cursor--;
                this.getData();*/
            },
            /**
             * 下一页
             */
            nextClick() {
                /* this.pagination.currentPage++;
                 this.postData.cursor++;
                 this.getData();*/
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.clearSelIds();
                this.pagination.size = this.postData.size = val;
                this.getData();
            },
            // 详情
            handleClick(data) {
                console.log(data);
                this.$router.push({path: '/device/detail', query: {deviceNo: data.device_no}})
            },
            /**
             * 表格多选
             */
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            /**
             *  表格
             */
            toggleRowSelection(row, i) {
                console.log("dianwola", row, i)
            },
            onSubmit() {
                console.log('submit!');
                this.clearSelIds();
                this.pagination.currentPage = this.postData.cursor = 1;
                this.submitState = true;
                this.getData();
            },
            //获取topdata
            getTop() {
                this.$axios.post('/admin/devices/top/data')
                    .then(res => {
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.showList[0].value = res.data.data.total_no;
                            this.showList[1].value = res.data.data.stock_no;
                            this.showList[2].value = res.data.data.use_no
                        } else {
                            this.$message.error(res.data.message)
                        }
                        console.log("获取统计", res)
                    })
                    .catch(rej => {
                        this.$message.error('网络异常')
                    })
            },
            //获取设备名称列表
            getDeviceNameList() {
                this.$axios.post('/admin/devices/deviceName')
                    .then(res => {
                        console.log("获取设备名称list", res);
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.deviceNameList = res.data.data;
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
                this.$axios.post('/admin/devices/list', this.postData).then(res => {
                    this.loading = false;
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.$nextTick(() => {
                            if (this.tableData && this.multipleSelectionId && this.multipleSelectionId[this.pagination.currentPage]) {
                                this.multipleSelectionId[this.pagination.currentPage].forEach((ele, i) => {
                                    this.tableData.forEach((val, v) => {
                                        if (ele == val.device_no) {
                                            this.$refs.multipleTable.toggleRowSelection(val, true);
                                        }
                                    })
                                })
                            }
                        });
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
            //获取设备状态list
            getDeviceStatus() {
                this.loading = true;
                //初始化列表
                this.$axios.post('/admin/devices/status').then(res => {
                    this.loading = false;
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.statusList = res.data.data;
                    } else {
                        this.$message.error(res.data.message)
                    }
                })
                    .catch(() => {
                        this.loading = false;
                        this.$message.error("网络异常")
                    });
            },
            /**
             * 批量回收
             */
            recycleBtn(formName) {
                console.log('批量回收');
                this.buildSubmitIds();
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.recycleState = true;
                        this.$axios.post('/admin/devices/recycle/bath', {"device_nos": this.device_nos}).then(res => {
                            console.log(res);
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message('回收成功');
                                this.clearSelIds();
                                this.getData();
                            } else {
                                this.$message(res.data.message);
                            }
                            this.recycleState = false;
                        }).catch(() => {
                            this.recycleState = false;
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            /**
             * 单个回收
             */
            recycleClick(data) {
                console.log('单个回收',data);
                        console.log('submit!');
                this.$axios.post('/admin/devices/recycle', {"device_no": data.device_no}).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.$message('回收成功');
                        this.clearSelIds();
                        this.getData();
                    } else {
                        this.$message(res.data.message);
                    }
                }).catch(() => {

                })
            },
            /**
             * 删除
             */
            delClick(data) {
                console.log('删除',data);
                        console.log('submit!');
                this.$confirm('确定删除此设备吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/admin/devices/device/del', {"device_no": data.device_no}).then(res => {
                        console.log(res);
                        if (res.data.code == this.$webConfig.httpSuccessStatus) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.clearSelIds();
                            this.getData();
                        } else {
                            this.$message(res.data.message);
                        }
                    }).catch(() => {
                        this.$message('网络异常！');
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

        },
        mounted() {
            this.getTop();
            this.getData();
            this.getDeviceStatus();
            this.getDeviceNameList()
        }
    }
</script>

<style>
    .main-inner {
        padding: 13px 40px;
    }
    .redColor {
        color: red;
    }
    .redColor:hover {
        color: rgba(255, 0, 0, 0.78);
    }
</style>
