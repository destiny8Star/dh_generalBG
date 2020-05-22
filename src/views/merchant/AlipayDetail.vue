<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
                <div class="main-feature">
                    <div class="main-inner" :style="{minHeight: (getWinHeight-20)+'px'}">
                        <h1 class="ly-title-one">商户进件详情（支付宝直连）
                            <el-button type="primary" size="mini" style="float: right;margin-top: 10px"
                                       @click="$router.push('/merchant/alipayAudit')">返回
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
                                    <p v-if="ele.value" class="realBox">{{ele.table}}：<span>{{ele.value}}</span></p>
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
                        <!--<div class="imgUpload">
                            <div class="title">商家特约协议</div>
                            <div style="text-align: left;padding: 6px">
                                &lt;!&ndash;<p style="margin-bottom: 10px;">图片最多上传4张</p>&ndash;&gt;
                                <el-upload
                                        :action="this.$webConfig.qnUploadHost"
                                        :data="qn"
                                        list-type="picture-card"
                                        :limit="4"
                                        name="photo"
                                        :on-preview="handlePictureCardPreview"
                                        :on-exceed="handleExceed"
                                        :on-success="protocolImgWin"
                                        :on-error="protocolImgFail"
                                        :before-upload="beforeAvatarUpload"
                                        :on-remove="handleRemove">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible" size="tiny">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>
                            </div>
                            &lt;!&ndash;<div class="imgBox" v-for="(ele,i) in imgPermit" :key="i" @click="lookBigImg(ele)" :class="{bigAct:ele.flag}">
                                <img :src="ele.value" alt="">
                                <p>{{ele.table}}</p>
                            </div>&ndash;&gt;
                        </div>-->
                        <div class="form-list" style="margin-top: 30px;" v-if="status==3">
                            <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                                <el-form-item label="支付宝费率:" prop='ali_rate' type='number'>
                                    <el-input v-model="form.ali_rate" placeholder="费率为0.38%~0.6%之间"
                                              @keyup.native='ainpChange'></el-input>
                                </el-form-item>
                                <el-row style="padding: 30px">
                                    <el-button size="medium" type="primary" @click="onSubmit('form')">通过</el-button>
                                    <el-button size="medium" type="danger" @click="derivedData">驳回</el-button>
                                </el-row>
                            </el-form>
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
                    // wx_store_no: '',//微信商户号
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
                }
            }
        },
        methods: {
            //小数点判断
            NumberCheck(num) {
                var str = num;
                var len1 = str.substr(0, 1);
                var len2 = str.substr(1, 1);
                //如果第一位是0，第二位不是点，就用数字把点替换掉
                if (str.length > 1 && len1 == 0 && len2 != ".") {
                    str = str.substr(1, 1);
                }
                //第一位不能是.
                if (len1 == ".") {
                    str = "";
                }
                //限制只能输入一个小数点
                if (str.indexOf(".") != -1) {
                    var str_ = str.substr(str.indexOf(".") + 1);
                    if (str_.indexOf(".") != -1) {
                        str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
                    }
                }
                //正则替换，保留数字和小数点
                // str = str.replace(/[^\d^\.]+/g,'')
                //如果需要保留小数点后两位，则用下面公式
                str = str.replace(/\.\d{3}$/, '')
                return str;
            },
            //输入框
            ainpChange() {
                let val = this.form.ali_rate
                this.form.ali_rate = this.NumberCheck(val)
                console.log('bva', val,)
            },
            //输入框
            winpChange() {
                let val = this.form.wx_rate
                this.form.wx_rate = this.NumberCheck(val)
                console.log('bva', val)
            },
            /**
             * 协议图删除
             * @param file
             * @param fileList
             */
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.protocolImg.forEach(ele => {
                    console.log(ele);
                    if (ele.url === file.url) {
                        this.protocolImg.splice(this.protocolImg.indexOf(ele), 1);
                    }
                });
                console.log(this.protocolImg);
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
                let that = this;
                return new Promise((resolve, reject) => {
                    /** browser-image-compression 开始 **/

                    // var imageFile = event.target.files[0];
                    console.log('originalFile instanceof Blob', file instanceof Blob); // true
                    console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

                    var options = {
                        maxSizeMB: 1,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true
                    };
                    imageCompression(file, options)
                        .then(function (compressedFile) {
                            console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
                            console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
                            let isJPG = false;
                            if (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg') {
                                isJPG = file.type;
                            }
                            const isLt1M = compressedFile.size / 1024 / 1024 < 1;
                            let width = 718;
                            let height = 376;
                            let _URL = window.URL || window.webkitURL;
                            let image = new Image();
                            image.onload = function () {
                                let valid = image.width <= width && image.height <= height;
                                console.log(image.width, image.height, compressedFile.size);
                                let resultBlob = '';
                                // 调用方法获取blob格式，方法写在下边[有损压缩，不用]
                                resultBlob = that.compressUpload(image);
                                resolve();
                                // valid ? resolve(resultBlob) : reject();
                                // resolve(resultBlob)
                            };
                            image.src = _URL.createObjectURL(compressedFile);

                            if (!isJPG) {
                                this.$message.error('上传图片只能是 JPG 或者 PNG 格式!');
                            }
                            if (!isLt1M) {
                                this.$message.error('上传图片大小不能超过 1MB!');
                            }
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                    /** browser-image-compression 结束**/
                }).then(
                    () => {
                        return file;
                    },
                    () => {
                        this.$message.error('');
                        return Promise.reject();
                    }
                );
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
            protocolImgWin(response, file, fileList) {
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
            },
            /**
             * 协议图上传失败
             */
            protocolImgFail(err, file, fileList) {
                console.log(err, file, fileList);
                this.$message.warning(err.message);
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
                this.loading = true
                this.$axios.get('/admin/store/detail?id=' + this.id).then(res => {
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


                    } else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.loading = false
                        this.$message('网络异常！');
                    });
            },
            /**
             * 提交
             */
            onSubmit(formName) {
                console.log('submit!', this.form);
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$confirm('此操作将通过审核, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.loading = true
                            this.$axios.post('/admin/store/audit', this.form)
                                .then(res => {
                                    this.loading = false
                                    if (res.data.code == 200) {
                                        this.$message.success('审核成功')
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
                                message: '已取消通过审核'
                            });
                        });

                    }
                })
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
                    data.status = 2
                    data.type = 2
                    this.loading = true
                    this.$axios.post('/admin/store/audit', data)
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
            console.log('id', this.id, this.status)
        },
        mounted() {
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
</style>

