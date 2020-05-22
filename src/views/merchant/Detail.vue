<template>
	<div>
		<div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
			<div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
				<div class="main-feature">
					<div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}">
						<h1 class="ly-title-one">商户详情 <el-button type="primary" size="mini" style="float: right;margin-top: 10px" @click="$router.push('/merchant/list')">返回</el-button> </h1>
						<div class="infoBox">
							<div class="home-title">
								<span class="home-title-t">基本信息</span>
							</div>
							<div class="realBoxs">
								<div v-for="(ele,i) in infoData" :key="i">
									<p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
								</div>
							</div>
							<div class="home-title">
								<span class="home-title-t">银行卡信息</span>
							</div>
							<div class="realBoxs">
								<div v-for="(ele,i) in cardData" :key="i">
									<p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
								</div>
							</div>
							<div class="home-title">
								<span class="home-title-t">商铺信息</span>
							</div>
							<div class="realBoxs">
								<div v-for="(ele,i) in shopData" :key="i">
									<p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
								</div>
							</div>
						</div>
						<!--<div class="realBoxs" v-loading='loading'>
							<div class="realBox">
								<div v-for="(ele,i) in infoData" :key="i">
									<p v-if="ele.value">{{ele.table}}：<span>{{ele.value}}</span></p>
								</div>
							</div>
							<div class="realBox">
								<div v-for="(ele,i) in infoList" :key="i">
									<p v-if="ele.value">{{ele.table}}：<span>{{ele.value}}</span></p>
								</div>
							</div>
						</div>-->
						<div class="imgBoxs">
							<div v-for="(ele,i) in imgCard" :key="i" @click="lookBigImg(ele)" :class="{bigAct:ele.flag}">
								<div v-if="ele.value" class="imgBox">
									<img :src="ele.value" alt="">
									<p>{{ele.table}}</p>
								</div>
							</div>
						</div>
						<div class="imgBoxs">
							<div v-for="(ele,i) in imgShop" :key="i" @click="lookBigImg(ele)" :class="{bigAct:ele.flag}">
								<div v-if="ele.value" class="imgBox">
									<img :src="ele.value" alt="">
									<p>{{ele.table}}</p>
								</div>
							</div>
						</div>
						<div class="imgBoxs" v-if="imgSpecial[0].value">
							<div class="imgBox" v-for="(ele,i) in imgSpecial" :key="i" @click="lookBigImg(ele)" :class="{bigAct:ele.flag}">
								<img :src="ele.value" alt="">
								<p>{{ele.table}}</p>
							</div>
						</div>
						<!-- 进件预留【特约协议】 start -->
						<!-- <div class="imgBoxs">
							<div class="imgBox" v-for="(ele,i) in imgPermit" :key="i" @click="lookBigImg(ele)" :class="{bigAct:ele.flag}">
								<img :src="ele.value" alt="">
								<p>{{ele.table}}</p>
							</div>
						</div> -->
						<!-- 进件预留【特约协议】 end -->
						<h1 class="ly-title-one">商户手续费</h1>
						<div class="fee">
                              <p v-for="(ele,i) in infoFee" :key='i'>{{ele.table}}:{{ele.value}}</p>
						</div>
					</div>
				</div>
				<common-footer></common-footer>
			</div>
		</div>
	</div>
</template>

<script>
	import CommonFooter from '../../components/CommonFooter.vue'
	let mapType = {'TP_MERCHANT': '商户','TP_PERSONAL':'个人'};
	let mapNature = {57: '对公',58: '对私'};

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
				id:'', //商户id
                status: '',//【1：直连；2：间连】
				loading: false,
                auth_status: 1,//auth_status,支付宝授权状态( 0 失效 ,1 正常)
                infoData: [
					{
					    table: '渠道类型',
						value: ''
					},
					{
					    table: '姓名',
						value: ''
					},
					{
					    table: '手机号',
						value: ''
					},
					{
					    table: '邮箱',
						value: ''
					},
					{
					    table: '身份证号码',
						value: ''
					},
					{
					    table: '身份证有效期',
						value: ''
					},
					{
					    table: '微信商户号',
						value: ''
					},
                    {
                        table: '支付宝账号',
                        value: ''
                    },
                    {
                        table: '推荐人(身份)',
                        // table: '所属服务商/分销商',
                        value: ''
                    },
				],
                cardData: [
					{
					    table: '持卡人姓名',
						value: ''
					},
					{
					    table: '账户性质',
						value: ''
					},
					{
					    table: '银行卡号',
						value: ''
					},
					{
					    table: '开户银行',
						value: ''
					},
					{
					    table: '开户支行',
						value: ''
					}
				],
                shopData: [
					{
					    table: '商户名',
						value: ''
					},
					{
					    table: '区域',
						value: ''
					},
					{
					    table: '地址',
						value: ''
					},
					{
					    table: '所属行业',
						value: ''
					},
					{
					    table: '营业执照名称',
						value: ''
					},
					{
					    table: '统一社会信用代码',
						value: ''
					},
					{
					    table: '申请费率',
						value: ''
					},
					{
					    table: '结算费率',
						value: ''
					}
				],
                infoList: [
					{
					    table: '微信商户号',
						value: ''
					},
					{
					    table: '姓名',
						value: ''
					},
					{
					    table: '邮箱',
						value: ''
					},
					{
					    table: '所属行业',
						value: ''
					},
					{
					    table: '开户银行',
						value: ''
					},
					{
					    table: '开户支行',
						value: ''
					},
					{
					    table: '支付宝账号',
						value: ''
					},
					
				],
				infoFee: [
					{
 						table: '支付宝费率',
						value: ''
					},
					{
 						table: '微信费率',
						value: ''
					},
				],
                imgCard: [
					{
					    table: '身份证照（正）',
						value:'',
						flag: false
					},
					{
					    table: '身份证照（反）',
						value: '',
						flag: false
					},
					{
					    table: '手持身份证照',
						value:'',
						flag: false
					},
					{
					    table: '银行卡照',
						value:'',
						flag: false
					}
				],
                imgShop: [
					{
					    table: '营业执照',
						value:"",
						flag: false
					},
					{
					    table: '开户许可证',
						value:"",
						flag: false
					},
					{
					    table: '门头照',
						value:"",
						flag: false
					},
					{
					    table: '收银台照',
						value:"",
						flag: false
					},
					{
					    table: '店内环境照',
						value:"",
						flag: false
					}
				],
				imgSpecial: [
					{
						table: '特殊资质',
						value:"",
						flag: false
					}
				],
                imgPermit: [
					{
					    table: '商家特约协议',
						value: require('../../assets/img/logo.png'),
						flag: false
					},
					/*{
					    table: '邮箱',
						value: require('../../assets/img/logo.png')
						flag: false
					}*/
				],
			}
		},
		methods: {
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
				this.loading=true;
				let api = '';
				if(this.status==1){
				    api = '/admin/store/detail'
				}else if(this.status==2){
                    api = '/admin/store/lkl/detail'
                }
                this.$axios.get(api+'?id='+this.id).then(res => {
					console.log('获取商户数据',res);
					this.loading = false;
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;
                        // this.auth_status = list.auth_status;
                        this.infoData[0].value = mapType[list.channel_type];
                        this.infoData[1].value = list.real_name;
						this.infoData[2].value = list.contact_mobile;
                        this.infoData[3].value = list.contact_email;
						this.infoData[4].value = list.id_card;
                        this.infoData[5].value = list.id_card_expire=='2999-12-31'?'永久':list.id_card_expire;
						this.infoData[6].value = list.wx_store_no;
						this.infoData[7].value = list.alipay_account;
						this.infoData[8].value = list.agent_tel;

                        this.cardData[0].value = list.settle_bank_account_name;
                        this.cardData[1].value = mapNature[list.account_kind];
                        this.cardData[2].value = list.settle_bank_account;
                        this.cardData[3].value = list.settle_bank;
						this.cardData[4].value = list.settle_bank_branch;

                        this.shopData[0].value = list.mer_short_name;
                        this.shopData[1].value = list.area;
                        this.shopData[2].value = list.address;
                        this.shopData[3].value = list.industry;
						this.shopData[4].value = list.business_license_name;
						this.shopData[5].value = list.business_license_no;
						this.shopData[6].value = list.settle_rate;
						this.shopData[7].value = list.rate;

						this.infoFee[0].value = list.ali_rate;
						this.infoFee[1].value = list.wx_rate;
						
					    this.imgCard[0].value = list.id_card_positive_pic;
					    this.imgCard[1].value = list.id_card_negative_pic;
						this.imgCard[2].value = list.holding_certificate_pic;
						this.imgCard[3].value = list.bank_card_pic;

						this.imgShop[0].value = list.business_license_pic_url;
						this.imgShop[1].value = list.permits_accounts_pic;
						this.imgShop[2].value = list.shop_sign_board_pic;
						this.imgShop[3].value = list.cashier_desk_pic;
						this.imgShop[4].value = list.shop_scene_pic;

						this.imgSpecial[0].value = list.certification_requirements_pic
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch((rej) => {
						this.loading=false
						console.log('错误',rej)
						this.$message('网络异常!');
                    });
            },
		},
		created(){
		    if(this.$route.query.status){
		        this.status = this.$route.query.status;
                this.id = this.$route.query.merchantId
			}
		},
		mounted(){
            // 获取数据
		    this.getData();
		}
	}
</script>

<style scoped>
	.home-title {
		margin: 20px 0 10px;
		font-weight: 800;
	}
	.main-inner {
		padding: 13px 40px;
	}
	.realBoxs {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	.realBox {
		width: 30%;
		min-width: 460px;
		max-width: 460px;
		font-size: 16px;
		line-height: 32px;
		margin: 2px 20px 2px 0;
	}
	.realBox span{
		margin-left: 10px;
	}
	.imgBoxs {
		display: flex;
		align-items: flex-start;
		margin-top: 30px;
	}
	.imgBox {
		margin: 15px;
	}
	.imgBox img {
		width: 200px;
		height: 140px;
		box-shadow: 1px 1px 12px 1px #e2e2e2
	}
	.imgBox p {
		text-align: center;
	}
	.fee{
		width: 100%;
		display: flex;
		align-items: center;
		font-size: 16px;
		margin: 20px 0
	}
	.fee p{
		margin-right: 40px
	}
	.bigAct {
		z-index: 9999;
		width: 100vw !important;
		height: 100vh !important;
		position: fixed;
		left: 0;
		top: 0;
		margin: 0;
		background: rgba(51, 51, 51, 0.4);
	}
	.bigAct img {
		transform: scale(3, 3);
		position: absolute;
		margin: auto;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		transition: all 1s;
		box-shadow: none;
	}
</style>

