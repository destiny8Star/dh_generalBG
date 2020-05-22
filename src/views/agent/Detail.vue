<template>
	<div>
		<div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
			<div class="third-nav">
				<div class="third-nav-t">代理商详情</div>
			</div>
			<div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
				<div class="main-feature">
					<div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}">
						<!--<h1 class="ly-title-one">基本信息</h1>-->
						<div class="home-title ly_title">
							<span class="home-title-t">基本信息</span>
						</div>
						<!--<el-card class="realBoxs">-->
							<el-card class="realBox">
								<p v-for="(ele,i) in infoData" :key="i">{{ele.table}}：<span>{{ele.value}}</span></p>
							</el-card>
						<!--</el-card>-->
						<div class="home-title ly_title" style="margin-top: 40px">
							<span class="home-title-t">邀请团队</span>
						</div>
						<!-- tab按钮 start -->
						<div class="third-nav">
							<el-tabs v-model="postData.label" type="card" @tab-click="tabSelect">
								<el-tab-pane v-for="(ele,i) in tabList" :key="i" :label="ele.label" :name="ele.value"></el-tab-pane>
								<!--<el-tab-pane v-for="(ele,i) in tabList" :key="i" :label="`${ele.label}（${ele.num}人）`" :name="ele.value"></el-tab-pane>-->
							</el-tabs>
						</div>
						<!-- tab按钮 end -->
						<!-- 表格 start -->
						<template>
							<el-table ref="multipleTable" :data="tableData" style="width: 100%;min-width: 780px;margin-top: 30px"
									  @selection-change="handleSelectionChange">
								<!--<el-table-column type="index" fixed width="80" label="编号">-->
									<!--<template slot-scope="scope">{{ ((pagination.currentPage -1) * pagination.pageSize) + (scope.$index + 1)}}-->
									<!--</template>-->
								<!--</el-table-column>-->
								<!-- <el-table-column prop="agent_no" label="编号">
                                 </el-table-column>-->
								<el-table-column prop="name" label="用户名">
								</el-table-column>
								<el-table-column prop="real_name" label="姓名">
								</el-table-column>
								<el-table-column prop="agent_service_tel" label="手机号">
								</el-table-column>
								<el-table-column prop="agent_level_desc" label="角色">
								</el-table-column>
								<el-table-column prop="agent_area" label="所属区域">
									<template slot-scope="scope">
										{{ scope.row.agent_area ? scope.row.agent_area : '--' }}
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
		name: "detail",
		components: {
			CommonFooter
		},
		computed: {
			getWinHeight: function () {
				return this.$winHeight;
			}
		},
		data: function () {
			return {
                agentId: '',
                tabIndex: '1',//tab选中值
                tabList: [
                    {
                        value: '1',
                        label: '直推',
						num: 1
                    },
                    {
                        value: '2',
                        label: '间推',
						num: 1
                    }
                ],
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
					"label": '1',
                    "id": '',
                },
                tableData: [
                    {
                        id: 1,
                    }
                ],
                infoData: [
					{
					    table: '公司名',
						value: '冰冻三尺'
					},
					{
					    table: '姓名',
						value: '冰冻三尺'
					},
					{
					    table: '手机号',
						value: '132****1623'
					},
					{
					    table: '支付宝号',
						value: '132****1623'
					},
					{
					    table: '邮箱',
						value: '15836669878@163.com'
					},
					{
					    table: '等级',
						value: '辽宁省沈阳市苏家屯区'
					},
					{
					    table: '所属区域',
						value: '辽宁省沈阳市苏家屯区'
					},
					{
					    table: '合作时间',
						value: '6228480048814917976'
					},
					{
					    table: '推荐人',
						value: '杜鲁阳'||'--'
					},
				],
			}
		},
		methods: {

            /**
             * tab选择
             * @param key
             * @param keyPath
             */
            tabSelect(tab, event) {
                this.postData.label = tab.name;
                console.log(tab.name, event,this.postData.label);
                this.getListData();
            },
            /**
             *  查看大图
             */
            lookBigImg(target) {
                target.flag = !target.flag;
            },
            /**
             * 获取数据
             */
            getData() {
                //初始化列表
                this.$axios.post('/admin/agent/agentSubjectInfo',{"id":this.postData.id}).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;
                        this.infoData[0].value = list.name;
                        this.infoData[1].value = list.real_name;
                        this.infoData[2].value = list.agent_service_tel;
                        this.infoData[3].value = list.ali_login_name;
                        this.infoData[4].value = list.agent_email||'--';
                        this.infoData[5].value = list.agent_level_desc;
                        this.infoData[6].value = list.agent_area;
                        this.infoData[7].value = new Date(list.create_time).format('yyyy-MM-dd hh:mm:ss')||'--';
                        this.infoData[8].value = list.referee_tel||'--';
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
            /**
             * 获取列表数据
             */
            getListData() {
                //初始化列表
				let api = '';
				if(this.postData.label == 1){
				    api = '/admin/agent/directAgentTeam'
				}else if(this.postData.label == 2){
                    api = '/admin/agent/inDirectAgentTeam'
                }
                this.$axios.post(api,this.postData).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.tableData = res.data.data.data;
                        this.pagination.total = res.data.data.count;
                        this.pagination.currentPage = res.data.data.cursor;
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
            handleSelectionChange(){

			},
            /**
             * 分页跳转【当前页】
             */
            jumpPagination(val) {
                console.log(val);
                this.pagination.currentPage = this.postData.cursor = val;
                // this.postData.cursor = val;
                this.getListData();
            },
            /**
             * 上一页
             */
            prevClick() {
                this.pagination.currentPage --;
                this.postData.cursor --;
                this.getListData();
            },
            /**
             * 下一页
             */
            nextClick() {
                this.pagination.currentPage ++;
                this.postData.cursor ++;
                this.getListData();
            },
            /**
             * 每页条数
             * @param val
             */
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pagination.size = this.postData.size = val;
                this.getListData();
            },
		},
		mounted(){
		    if(this.$route.query.agentId){
                this.postData.id = this.$route.query.agentId
			}

            // 获取数据
		    this.getData();
		    this.getListData();
		}
	}
</script>

<style scoped>
	.main-inner {
		padding: 13px 40px;
	}
	.realBoxs {
		display: flex;
		align-items: center;
		margin-bottom: 20px;
	}
	.realBox {
		width: 40%;
		margin-right: 20px;
	}
	.realBox p{
		font-size: 16px;
		line-height: 32px;
	}
	.realBox span{
		margin-left: 10px;
	}
	.ly_title {
		margin: 20px 0;
	}
	.home-title-t {
		font-size: 16px;
	}
</style>

