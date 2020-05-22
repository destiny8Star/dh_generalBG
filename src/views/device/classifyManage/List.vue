<template>
	<div>
		<div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <!-- tab按钮 start -->
            <div class="third-nav" style="display: flex;align-items: center;justify-content: space-between">
                <div class="third-nav-t">分类管理</div>
                <el-button style="margin: 0 30px" size="small" type="primary" @click = "$router.push('/device')">返回</el-button>
            </div>
            <!-- tab按钮 end -->
			<div class="main-content" id="main-content" :style="{height: (getWinHeight-120)+'px'}">
				<div class="main-feature">
					<div class="main-inner" v-loading="loading" >
                          <el-row style="margin: 20px 15px 30px;">
                            <el-button size="medium" type="primary" @click = "handleClick">添加分类</el-button>
                        </el-row>
						 <!-- 表格 start -->
                        <template>
                            <el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;"
                                      @selection-change="handleSelectionChange">
                                <el-table-column type="index" fixed width="80" label="序号">
                                    <template slot-scope="scope">{{ ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1)}}
                                </template>
                                </el-table-column>
                                <el-table-column prop="name" label="分类">
                                </el-table-column>
                                <el-table-column fixed="right" label="操作" width="100">
                                        <el-button type="text" @click="handleClick">修改</el-button>
                                        <!-- <el-button type="text" @click="handleClick" style="color:#F56C6C">删除</el-button> -->
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
	import CommonFooter from '../../../components/CommonFooter.vue'
	export default {
		name: "List",
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
                loading:false,
                tableData: [
                    {   
                        id:'',
                        name:"刷脸设备",
                    }
                ],
				winHeight: window.innerHeight,
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
                },
			}
		},
		methods: {
             /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getData(this.postData);
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage --;
                this.postData.cursor --;
                this.getData(this.postData);
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage ++;
                this.postData.cursor ++;
                this.getData(this.postData);
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagination.size = this.postData.size = val;
                this.getData(this.postData);
            },
            handleSelectionChange(val) {
                // this.multipleSelection = val;
            },
        
            handleClick(row) {
                  this.$message('暂未开放!','warning')    
            },
            //获取数据
            getData(datas) {
               this.loading=true;
                let  api = '/admin/device/type/list';
                console.log(datas);
                //初始化列表
                this.$axios.post(api, datas).then(res => {
                       this.loading=false;
                        console.log(res);
                        if (res.data.code === this.$webConfig.httpSuccessStatus) {
                            this.tableData = res.data.data.data;
                            this.pagination.total = res.data.data.count;
                            this.pagination.currentPage = res.data.data.cursor;
                        }
                    })
                    .catch(() => {
                       this.loading=false;
                       this.$message.error("网络异常")
                    });
            },
	
		},
		created(){
           this.getData(this.postData)
		}
	}
</script>

<style>
	.main-inner {
		padding: 13px 40px;
	}
    .boxMess{
       height: 100px;
       overflow-y: scroll
    }
    .enable{
        color:#67C23A!important
    }

</style>
