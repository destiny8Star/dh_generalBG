<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="third-nav">
                <div class="third-nav-t">设备管理</div>
            </div>
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <!-- 搜索条件 start -->
                        <!--  <el-form :inline="true" :model="formInline" class="demo-form-inline">
                              <el-form-item label="日期">
                                  <el-date-picker v-model="formInline.date" type="datetimerange" start-placeholder="开始日期"
                                                  end-placeholder="结束日期" :default-time="['12:00:00']">
                                  </el-date-picker>
                              </el-form-item>
                              <el-form-item label="门店名">
                                  <el-select v-model="formInline.shopName" placeholder="门店名">
                                      <el-option v-for="item in shopList"
                                                 :key="item.value"
                                                 :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="订单号">
                                  <el-input v-model="formInline.orderNo" placeholder="请输入订单号"></el-input>
                              </el-form-item>
                              <el-form-item label="订单状态">
                                  <el-select v-model="formInline.orderType" placeholder="订单状态">
                                      <el-option v-for="item in orderState"
                                                 :key="item.value"
                                                 :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="收银员">
                                  <el-select v-model="formInline.cashier" placeholder="收银员">
                                      <el-option v-for="item in cashierList"
                                                 :key="item.value"
                                                 :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item>
                                  <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
                              </el-form-item>
                          </el-form>-->
                        <!-- 搜索条件 end -->

                        <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column label="图片">
                                    <template slot-scope="scope">
                                        <img :src="scope.row.device_pic" class="table-img">
                                    </template>
                                </el-table-column>
                                <el-table-column prop="device_no" label="设备SN">
                                </el-table-column>
                                <el-table-column prop="device_name" label="名称">
                                </el-table-column>
                                <el-table-column prop="create_time" label="激活时间">
                                </el-table-column>
                                <!-- <el-table-column label="操作" min-width='115'>
                                     <template slot-scope="scope">
                                         <el-button type="text" style="color:red" @click="untie(scope.row)">解绑</el-button>
                                         <el-dialog :modal-append-to-body='false' title="解绑验证" :visible.sync="showSend">
                                             <el-form :model="logisticsInfo">
                                                 <el-form-item label="手机号" :label-width="sendWidth">
                                                     <el-input v-model="logisticsInfo.logisticsName" autocomplete="off"></el-input>
                                                 </el-form-item>
                                                 <el-form-item label="验证码" :label-width="sendWidth">
                                                     <el-input v-model="logisticsInfo.logisticsNo" autocomplete="off"></el-input>
                                                 </el-form-item>
                                                 <el-button @click="sendCode" style="margin: 0 120px " size="small" type="primary">发送验证码</el-button>
                                             </el-form>
                                             <div slot="footer" class="dialog-footer">
                                                 <el-button @click="showSend = false">取 消</el-button>
                                                 <el-button type="primary" @click="untieClick(scope.row)">确 定</el-button>
                                             </div>
                                         </el-dialog>
                                     </template>
                                 </el-table-column>-->
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
    // import second_nav from '../../components/second-nav.vue'
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
        data() {
            return {
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
                },
                tabIndex: 1,//tab选中值
                tabList: [
                    {
                        value: 1,
                        label: '支付宝'
                    },
                    {
                        value: 2,
                        label: '微信'
                    }
                ],
                formInline: {
                    date: '',
                    shopName: '',
                    orderNo: '',
                    cashier: '',
                    orderType: '',
                },
                shopList: [
                    {
                        value: '1',
                        label: '草莓的店'
                    },
                    {
                        value: '2',
                        label: '金大班家'
                    }
                ],
                orderState: [
                    {
                        value: '1',
                        label: '已支付'
                    },
                    {
                        value: '2',
                        label: '未支付'
                    },
                    // {
                    //     value: '选项1',
                    //     label: '退款'
                    // }
                ],
                cashierList: [
                    {
                        value: '1',
                        label: '小二'
                    }
                ],
                tableData: [],
                "sendWidth": '120px',
                "showUpdate": false,//是否展示修改弹框
                "showSend": false,//是否展示发货
                "logisticsInfo": {
                    "logisticsName": '',
                    "logisticsNo": ''
                },
            }
        },
        methods: {
            /**
             * tab选择
             * @param key
             * @param keyPath
             */
            tabSelect(key, keyPath) {
                console.log(key, keyPath);
                this.pagination.currentPage = 1;
                this.postData.cursor = 1;
                this.getData();
            },
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
                this.$axios.post('/mer/device/deviceList', this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.tableData.forEach(ele => {
                            ele.create_time = new Date(ele.create_time).format('yyyy-MM-dd hh:mm:ss');
                        });
                        console.log(this.tableData);
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
            /**
             * 解绑
             */
            untie(ele) {
                /* this.$confirm('解绑后设备将无法使用, 是否继续?', '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'error'
                 }).then(() => {
                     this.$message({
                         type: 'success',
                         message: '解绑成功!'
                     });
                 }).catch(() => {
                     this.$message({
                         type: 'info',
                         message: '已取消解绑'
                     });
                 });*/
                this.showSend = true;
                // ele.showSend = true;

            },
            /**
             * 发送验证码
             */
            sendCode() {


            },
            /**
             *  判断解绑信息是否为空
             */
            isNull() {
                var regNo = /\S/;
                if (!regNo.test(this.logisticsInfo.logisticsName.trim())) {
                    this.$message({center: true, type: "info", message: "手机号不能为空"});
                    return false;
                }
                if (!regNo.test(this.logisticsInfo.logisticsNo.trim())) {
                    this.$message({center: true, type: "info", message: "验证码不能为空"});
                    return false;
                }
            },
            /**
             * 解绑确定
             */
            untieClick(ele) {
                if (this.isNull() == false) {
                    return false;
                }
                var getData = {
                    "id": this.orderId,
                    "logisticsNo": this.logisticsInfo.logisticsNo,
                    "logisticsName": this.logisticsInfo.logisticsName
                };
                /*Logistics.sendGoods(getData).then(res=>{
                    console.log(res);
                    if(res.code==200){
                        this.$message({ center: true, type: "info", message: "发货成功" });
                        this.$router.push({path:'/order/orderList',query:{orderStatus:this.status}});
                    }else if(res.code==100070 || res.code == 404){
                        this.$message.warning(res.message);
                        this.$router.push('/')
                    }else {
                        this.$message({ center: true, type: "info", message: res.message + "，发货失败" });
                    }
                })*/
            },
            /**
             * 查询
             */
            onSubmit() {
                console.log('submit!');
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
        },
    }
</script>

