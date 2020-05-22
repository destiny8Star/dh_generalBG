<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}" v-loading="loading">
                        <h1 class="ly-title-one">商户进件详情（拉卡拉）
                            <el-button type="primary" size="mini" style="float: right;margin-top: 10px"
                                       @click="$router.push('/merchant/lakalaAudit')">返回
                            </el-button>
                        </h1>
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
                                    <div v-if="ele.value" class="realBox">{{ele.table}}： <span>{{ele.value}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="imgBoxs">
                            <div v-for="(ele,i) in imgCard" :key="i" @click="lookBigImg(ele)"
                                 :class="{bigAct:ele.flag}">
                                <div v-if="ele.value" class="imgBox">
                                    <img :src="ele.value" alt="">
                                    <p>{{ele.table}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="imgBoxs">
                            <div v-for="(ele,i) in imgShop" :key="i" @click="lookBigImg(ele)"
                                 :class="{bigAct:ele.flag}">
                                <div v-if="ele.value" class="imgBox">
                                    <img :src="ele.value" alt="">
                                    <p>{{ele.table}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="imgBoxs" v-if="imgSpecial[0].value">
                            <div class="imgBox" v-for="(ele,i) in imgSpecial" :key="i" @click="lookBigImg(ele)"
                                 :class="{bigAct:ele.flag}">
                                <img :src="ele.value" alt="">
                                <p>{{ele.table}}</p>
                            </div>
                        </div>
                        <div class="imgBoxs" v-if="lklstatus != 0">
                            <div class="imgBox">
                                <img :src="lkl_mer_agree_pic" alt="">
                                <p>协议照片正面</p>
                            </div>
                            <div class="imgBox">
                                <img :src="lkl_mer_agree_back_pic" alt="">
                                <p>协议照片反面</p>
                            </div>
                        </div>
                        <div class="imgBoxs" v-if="lklstatus != 0">
                            <div class="imgBox" v-for="(ele,i) in subImg.other_pics" :key="i" @click="lookBigImg(ele)"
                                 :class="{bigAct:ele.flag}">
                                <img :src="ele" alt="">
                                <p>其它{{i+1}}</p>
                            </div>
                        </div>
                        <div class="form-list" style="margin-top: 30px" v-if="lklstatus == 0">
                            <el-form label-position="left" label-width="140px">
                                <div class="ly-flex-start">
                                    <el-form-item label="协议照片正面:" required class="form-item">
                                        <div class="tip">信息必须清晰可见</div>
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="lkl_mer_agree_pic" :src="lkl_mer_agree_pic" class="avatar"
                                                 @click="getToken('lkl_mer_agree_pic')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('lkl_mer_agree_pic')"></i>
                                        </el-upload>
                                    </el-form-item>
                                    <el-form-item label="协议照片反面:" required class="form-item">
                                        <div class="tip">信息必须清晰可见</div>
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="lkl_mer_agree_back_pic" :src="lkl_mer_agree_back_pic"
                                                 class="avatar"
                                                 @click="getToken('lkl_mer_agree_back_pic')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('lkl_mer_agree_back_pic')"></i>
                                        </el-upload>
                                    </el-form-item>
                                </div>
                                <el-form-item label="其它:" class="form-item">
                                    <div class="ly-flex-start">
                                        <!--<el-upload
                                                :action="this.$webConfig.qnUploadHost"
                                                list-type="picture-card"
                                                :file-list="subImg.other_pics"
                                                :on-preview="handlePictureCardPreview"
                                                :on-remove="handleRemove">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <el-dialog :visible.sync="dialogVisible">
                                            <img width="100%" :src="dialogImageUrl" alt="">
                                        </el-dialog>-->
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-remove="handleRemove"
                                                :on-preview="handlePictureCardPreview"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="other1" :src="other1" class="avatar"
                                                 @click="getToken('other1')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('other1')"></i>
                                        </el-upload>
                                        <el-upload
                                                class="avatar-uploader"
                                                :on-remove="handleRemove"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-preview="handlePictureCardPreview"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="other2" :src="other2" class="avatar"
                                                 @click="getToken('other2')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('other2')"></i>
                                        </el-upload>
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-remove="handleRemove"
                                                :on-preview="handlePictureCardPreview"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="other3" :src="other3" class="avatar"
                                                 @click="getToken('other3')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('other3')"></i>
                                        </el-upload>
                                        <el-upload
                                                class="avatar-uploader"
                                                :action="this.$webConfig.qnUploadHost"
                                                :data="qn"
                                                :show-file-list="false"
                                                :on-remove="handleRemove"
                                                :on-preview="handlePictureCardPreview"
                                                :on-success="handleAvatarSuccess"
                                                :before-upload="beforeAvatarUpload">
                                            <img v-if="other4" :src="other4" class="avatar"
                                                 @click="getToken('other4')">
                                            <i v-else class="el-icon-plus avatar-uploader-icon"
                                               @click="getToken('other4')"></i>
                                        </el-upload>
                                    </div>

                                </el-form-item>
                            </el-form>
                            <el-button type="primary" @click="submitForm">提交</el-button>
                            <el-button type="danger" @click="derivedData">驳回</el-button>
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

    let mapType = {'TP_MERCHANT': '商户', 'TP_PERSONAL': '个人'};
    let mapNature = {57: '对公', 58: '对私'};

    export default {
        name: "alipayDetail",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data: function () {
            let checkfee = (rule, value, callback) => {
                if (value < 0.38 || value > 0.6) {
                    return callback(new Error('费率范围为0.38%~0.6%'));
                }
                callback();
            }
            return {
                id: '',
                loading: false,
                status: '', //3待审核,2驳回
                lklstatus: '',//0未提交商户协议1已提交商户协议
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
                        table: '统一社会信用代码',
                        value: ''
                    },
                    {
                        table: '申请费率',
                        value: ''
                    },
                ],
                imgCard: [
                    {
                        table: '身份证照（正）',
                        value: "",
                        flag: false
                    },
                    {
                        table: '身份证照（反）',
                        value: "",
                        flag: false
                    },
                    {
                        table: '手持身份证照',
                        value: "",
                        flag: false
                    },
                    {
                        table: '银行卡照',
                        value: "",
                        flag: false
                    }
                ],
                imgShop: [
                    {
                        table: '营业执照',
                        value: "",
                        flag: false
                    },
                    {
                        table: '开户许可证',
                        value: "",
                        flag: false
                    },
                    {
                        table: '门头照',
                        value: "",
                        flag: false
                    },
                    {
                        table: '收银台照',
                        value: "",
                        flag: false
                    },
                    {
                        table: '店内环境照',
                        value: "",
                        flag: false
                    }
                ],
                imgSpecial: [
                    {
                        table: '特殊资质',
                        value: "",
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
                "dialogImageUrl": '',
                "dialogVisible": false,
                form: {
                    id: '',
                    wx_store_no: '',//微信商户号
                    ali_rate: '',//支付宝费率
                    status: 1,//1 审核成功 ,2 审核拒绝
                    type: 2,//1微信,2支付宝
                },
                rules: {
                    ali_rate: [
                        {
                            required: true,
                            message: '请输入支付宝费率',
                            trigger: 'blur'
                        },
                        {
                            validator: checkfee, trigger: 'blur'
                        },
                    ]
                },
                qn: {
                    token: "",
                    key: ""
                },
                onFN: "", //当前选择的参数
                lkl_mer_agree_pic: '',//协议正面照
                lkl_mer_agree_back_pic: '', //协议反面照
                other1: '',//其它1
                other2: '',//其它2
                other3: '',//其它3
                other4: '',//其它4
                subImg: {
                    id: '',
                    lkl_mer_agree_pic: '',//协议正面照
                    lkl_mer_agree_back_pic: '', //协议反面照
                    other1: '',//其它1
                    other2: '',//其它2
                    other3: '',//其它3
                    other4: '',//其它4
                    other_pics: [],//其它list
                },//要提交的图片
            }
        },
        methods: {
            /**
             *  图片上传成功
             */
            handleAvatarSuccess(res, file) {
                this[this.onFN] = URL.createObjectURL(file.raw);
                this.subImg[this.onFN] = this.$webConfig.apiHosts + this.qn.key
                console.log("file", res, file, this.subImg)
            },
            /**
             * 获取token
             */
            getToken(id) {
                console.log("aaa", id)
                this.onFN = id
                this.$axios.post('/admin/file/getUploadAuth')
                    .then(res => {
                        this.qn.token = res.data.data.file_upload_auth
                        console.log("获取token", res)
                    })
                    .catch(rej => {
                        console.log("失败", rej)
                    })
            },
            submitForm() {
                let lkl_mer_agree_pic = this.lkl_mer_agree_pic;
                let lkl_mer_agree_back_pic = this.lkl_mer_agree_back_pic
                if (!lkl_mer_agree_pic) return this.$message.error('请上传拉卡拉协议照片正面!');
                if (!lkl_mer_agree_back_pic) return this.$message.error('请上传拉卡拉协议照片反面!');
                this.loading = true;
                if(this.subImg.other1){
                    this.subImg.other_pics[0]=this.subImg.other1
                }
                if(this.subImg.other2){
                    this.subImg.other_pics[1]=this.subImg.other2
                }
                if(this.subImg.other3){
                    this.subImg.other_pics[2]=this.subImg.other3
                }
                if(this.subImg.other4){
                    this.subImg.other_pics[3] = this.subImg.other4
                }
                console.log(this.subImg.other_pics);
                this.$axios.post('/admin/store/lkl/lklStoreJJ', this.subImg)
                    .then(res => {
                        this.loading = false
                        if (res.data.code == 200) {
                            this.$alert('提交成功', {
                                confirmButtonText: '返回',
                                callback: action => {
                                    this.$router.go(-1)
                                }
                            });
                            // this.$message.success('提交成功')

                        } else {
                            this.subImg.other_pics = []
                            this.$message.error(res.data.message)
                        }
                        console.log("提交结果", res)
                    })
                    .catch(rej => {
                        this.subImg.other_pics = []
                        this.loading = false
                        this.$message.error('提交失败')
                        console.log("失败", rej)
                    })
            },
            /**
             * 协议图删除
             * @param file
             * @param fileList
             */
            handleRemove(file, fileList) {
                console.log(file, fileList);
                /*this.protocolImg.forEach(ele => {
                    console.log(ele);
                    if (ele.url === file.url) {
                        this.protocolImg.splice(this.protocolImg.indexOf(ele), 1);
                    }
                });
                console.log(this.protocolImg);*/
            },
            /**
             * 协议图预览
             * @param file
             */
            handlePictureCardPreview(file) {
                console.log(this.dialogImageUrl, file);
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
                console.log(this.dialogImageUrl)
            },
            /**
             * 图片上传前判断
             * @param file
             * @returns {boolean|Promise<T>}
             */
            beforeAvatarUpload(file) {
                this.qn.key = new Date().getTime() + Math.round(Math.random() * 10);  //上传到七牛的key
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt5M = file.size / 1024 / 1024 < 5;
                console.log("获取token成功", this.onFN, this.qn)
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isJPG && isLt5M;
            },
            /**
             * 协议图，当超上传限制时的提示
             */
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 4 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            /**
             * 协议图上传成功
             */
            /*protocolImgWin(response, file, fileList) {
                console.log(response, file, fileList);
                if (response) {
                    if (response.code == 200) {
                        this.protocolImg.push({url: response.data});
                    } else if (response.code == 100070) {
                        this.$message.warning(response.message);
                        this.$router.push('/')
                    } else {
                        file.status = 'fail';
                        fileList.splice(fileList.indexOf(file), 1);
                        this.$message({center: true, type: "warning", message: response.message});
                    }
                }
                console.log(this.protocolImg);
            },*/
            /**
             * 协议图上传失败
             */
            /*protocolImgFail(err, file, fileList) {
                console.log(err, file, fileList);
                this.$message.warning(err.message);
            },*/
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
                this.loading = true
                this.$axios.get('/admin/store/lkl/detail?id=' + this.id).then(res => {
                    console.log(res);
                    this.loading = false
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        let list = res.data.data;
                        // this.auth_status = list.auth_status;
                        this.infoData[0].value = mapType[list.channel_type];
                        this.infoData[1].value = list.real_name;
                        this.infoData[2].value = list.contact_mobile;
                        this.infoData[3].value = list.contact_email;
                        this.infoData[4].value = list.id_card;
                        this.infoData[5].value = list.id_card_expire == '2999-12-31' ? '永久' : list.id_card_expire;
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

                        this.lkl_mer_agree_pic = list.lkl_mer_agree_pic
                        this.lkl_mer_agree_back_pic = list.lkl_mer_agree_back_pic
                        this.subImg.lkl_mer_agree_pic = list.lkl_mer_agree_pic
                        this.subImg.lkl_mer_agree_back_pic = list.lkl_mer_agree_back_pic

                        this.lkl_mer_agree_pic = list.lkl_mer_agree_pic
                        this.lkl_mer_agree_back_pic = list.lkl_mer_agree_back_pic
                        this.subImg.other_pics = list.other_pics;
                        for(let i=0;i<this.subImg.other_pics.length;i++){
                            this[`other${i+1}`] = this.subImg.other_pics[i];
                            this.subImg[`other${i+1}`] = this.subImg.other_pics[i];
                        }
                        console.log(this.other1,this.other2,this.other3,this.other4)
                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.loading = false
                        this.$message('网络异常！');
                    });
            },
            //拒绝
            derivedData() {
                this.$prompt('请输入驳回理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /\S/,
                    inputErrorMessage: '请输入驳回理由'
                }).then(({value}) => {
                    let data = {}
                    data.id = this.id
                    data.audit_result = value
                    this.loading = true
                    this.$axios.post('/admin/store/lkl/audit', data)
                        .then(res => {
                            this.loading = false
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message.success('驳回成功')
                                this.$router.go(-1)
                            } else {
                                this.$message.error(res.data.message)
                            }
                            console.log("图加加结果", res)
                        })
                        .catch(rej => {
                            this.loading = false
                            this.$message.error('网络异常!')
                            console.log('失败', rej)
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            }
        },
        created() {
            this.id = this.$route.query.merchantId
            this.status = this.$route.query.status
            this.form.id = this.$route.query.merchantId
            this.subImg.id = this.$route.query.merchantId
            this.lklstatus = this.$route.query.lklstatus
            console.log('id', this.id, this.status, this.lklstatus)
        },
        mounted() {
            // 获取数据
            this.getData();
        }
    }
</script>

<style>
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
        /*overflow: hidden;*/
    }

    .realBox {
        width: 30%;
        max-width: 460px;
        min-width: 460px;
        font-size: 16px;
        line-height: 32px;
        margin: 2px 20px 2px 0;
    }

    .realBox span {
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

    .fee {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 16px;
        margin: 20px 0
    }

    .fee p {
        margin-right: 40px
    }

    .bigAct {
        width: 100vw !important;
        height: 100vh !important;
        z-index: 9999;
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

    .tip {
        font-size: 14px;
        color: #8c939d
    }

    .avatar-uploader {
        display: inline;
        margin-right: 15px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 140px;
        height: 140px;
        line-height: 140px;
        text-align: center;
    }

    .avatar {
        width: 140px;
        height: 140px;
        display: block;
    }

    .form-item {
        margin-right: 50px;
    }
</style>

