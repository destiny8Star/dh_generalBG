<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <h1 class="ly-title-one" style="margin-bottom: 40px">开通代理商</h1>
                        <div class="form-list">
                            <el-form label-position="left" ref="form" :model="form" label-width="130px" :rules="rules">
                                <el-form-item label="等级" prop="agent_level_index">
                                    <el-select v-model="form.agent_level_index" placeholder="请选择代理商等级" clearable>
                                        <el-option v-for="item in levelList"
                                                   :key="item.level"
                                                   :label="item.desc"
                                                   :value="item.level"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="区域" prop="choCity">
                                    <el-cascader :props="props" placeholder="请选择区域"
                                                 :options="cityList"
                                                 clearable
                                                 v-model="form.choCity"
                                                 @change="handleCtChange"
                                                 @active-item-change="handleCtChangeAc"></el-cascader>
                                </el-form-item>
                                <el-form-item label="用户名" prop="user_name">
                                    <el-input v-model="form.user_name" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                                <el-form-item label="公司名/个体名" prop="name">
                                    <el-input v-model="form.name" placeholder="请输入公司名/个体名"></el-input>
                                </el-form-item>
                                <el-form-item label="联系人姓名" prop="real_name">
                                    <el-input v-model="form.real_name" placeholder="请输入联系人姓名"></el-input>
                                </el-form-item>
                                <el-form-item label="手机号" prop="agent_service_tel">
                                    <el-input v-model="form.agent_service_tel" placeholder="请输入手机号"></el-input>
                                </el-form-item>
                                <el-form-item label="银行卡号" prop="settle_bank_account">
                                    <el-input v-model="form.settle_bank_account" placeholder="请输入银行卡号"></el-input>
                                </el-form-item>
                                <el-form-item label="开户银行" prop="settle_bank_name">
                                    <el-input v-model="form.settle_bank_name" placeholder="请输入开户银行"></el-input>
                                </el-form-item>
                                <el-form-item label="支付宝账号" prop="ali_login_name">
                                    <el-input v-model="form.ali_login_name" placeholder="请输入支付宝账号"></el-input>
                                </el-form-item>
                                <el-form-item label="公司地址" prop="address">
                                    <el-input v-model="form.address" placeholder="请输入公司地址"></el-input>
                                </el-form-item>
                                <el-form-item label="身份证号" prop="id_card">
                                    <el-input v-model="form.id_card" placeholder="请输入身份证号"></el-input>
                                </el-form-item>
                                <el-form-item label="邮箱" prop="agent_email">
                                    <el-input v-model="form.agent_email" placeholder="请输入邮箱"></el-input>
                                </el-form-item>
                                <el-form-item label="持卡人" prop="settle_bank_account_name">
                                    <el-input v-model="form.settle_bank_account_name" placeholder="请输入持卡人"></el-input>
                                </el-form-item>
                                <el-form-item label="支行" prop="settle_bank_branch">
                                    <el-input v-model="form.settle_bank_branch" placeholder="请输入支行"></el-input>
                                </el-form-item>
                                <el-form-item label="缴费金额" prop="payment_amount">
                                    <el-input v-model="form.payment_amount" placeholder="请输入缴费金额"></el-input>
                                </el-form-item>
                                <el-form-item label="推荐人" prop="referee_tel">
                                    <el-input v-model="form.referee_tel" placeholder="请输入推荐人手机号" @blur="checkTel"></el-input>
                                </el-form-item>
                                <!--action="https://jsonplaceholder.typicode.com/posts/"-->
                              <!--  <el-form-item label="打款截图" prop="remit_img">
                                    <el-upload
                                            class="avatar-uploader"
                                            :action="this.$webConfig.qnUploadHost"
                                            :data="qn"
                                            :show-file-list="false"
                                            :on-success="handleAvatarSuccess"
                                            :before-upload="beforeAvatarUpload">
                                        <img v-if="form.remit_img" :src="form.remit_img" class="avatar" @click="getToken()">
                                        <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken()"></i>
                                    </el-upload>
                                </el-form-item>-->
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('form')" v-loading="submitState">提交</el-button>
                                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                                    <!--<el-button>取消</el-button>-->
                                </el-form-item>
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
    let id = 0;
    export default {
        name: "Dredge",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            let redId = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X|x])$/;
            var checkNull = (rule, value, callback) => {
                // console.log(rule,'==',value,'==',callback)
                if (value.trim() === '') {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkIdNull = (rule, value, callback) => {
                if (!redId.test(value)) {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkLevelNull = (rule, value, callback) => {
                // console.log(rule,'==',value,'==',callback)
                if (value === '') {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkArrNull = (rule, value, callback) => {
                // console.log(rule,'==',value,'==',callback)
                if (value.length < 1) {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkTel = (rule, value, callback) => {
                let tel = /^1(3|4|7|5|6|9|8)([0-9]{9})$/;
                let reg = /^([0-9]{3,4}-)?[0-9]{7,8}|800[0-9]{7}|1(3|4|7|5|6|9|8)([0-9]{9})|0[0-9]{2,3}-[0-9]{8}|\d{3,4}-\d{3,4}-\d{3,4}$/;
                const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 0571-86295197
                const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/; // 4001-550-520
                const isMob=/^1[0-9]{10}$/;
                if (!tel.test(value)) {
                    callback(new Error('请输入正确的手机号'));
                } else {
                    callback();
                }
            };
            var checkTel1 = (rule, value, callback) => {
                let tel = /^1(3|4|7|5|6|9|8)([0-9]{9})$/;
                let reg = /^([0-9]{3,4}-)?[0-9]{7,8}|800[0-9]{7}|1(3|4|7|5|6|9|8)([0-9]{9})|0[0-9]{2,3}-[0-9]{8}|\d{3,4}-\d{3,4}-\d{3,4}$/;
                const isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/; // 0571-86295197
                const isPhone02 = /^\d{3,4}-\d{3,4}-\d{3,4}$/; // 4001-550-520
                const isMob=/^1[0-9]{10}$/;
                if(value){
                    if (!tel.test(value)) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                cityList: [],
                props: {
                    label: 'value',
                    value: 'id',
                    children: 'citys',
                    checkStrictly: true
                },
                // 七牛云图片上传
                qn: {
                    token: "",
                    key: ""
                },
                submitState: false,
                levelList: [],//等级list
                winHeight: window.innerHeight,
                form: {
                    "agent_level_index": '',
                    "choCity": [],
                    "province_code": '',
                    "city_code": '',
                    "area_code": '0',
                    "user_name": "",
                    "name": "",
                    "real_name": "",
                    "agent_service_tel": "",
                    "settle_bank_account": "",
                    "settle_bank_name": "",
                    "ali_login_name": "",
                    "address": "",
                    "id_card": "",
                    "agent_email": "",
                    "settle_bank_account_name": "",
                    "settle_bank_branch": "",
                    "payment_amount": '',
                    "referee_tel": "",
                    "remit_img": "",
                },
                store_logo: '',
                rules: {
                    choCity: [
                        {
                            validator: checkArrNull,
                            required: true,
                            message: '请选择区域',
                            trigger: 'change'
                        }
                    ],
                    agent_level_index: [
                        {
                            validator: checkLevelNull,
                            required: true,
                            message: '请选择代理商等级',
                            trigger: 'change'
                        }
                    ],
                    area_code: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请选择区域',
                            trigger: 'blur'
                        }
                    ],
                    user_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入用户名',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入公司名/个体名',
                            trigger: 'blur'
                        }
                    ],
                    real_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入代理商联系人姓名',
                            trigger: 'blur'
                        }
                    ],
                    agent_service_tel: [
                        {
                            validator: checkTel,
                            required: true,
                            message: '请输入正确的手机号',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 11,
                            message: '长度在 1 到 11 个字符',
                            trigger: 'blur'
                        }
                    ],
                    settle_bank_account: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入银行卡号',
                            trigger: 'blur'
                        }
                    ],
                    settle_bank_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入开户银行',
                            trigger: 'blur'
                        }
                    ],
                    ali_login_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入支付宝账号',
                            trigger: 'blur'
                        }
                    ],
                    address: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入公司地址',
                            trigger: 'blur'
                        }
                    ],
                    id_card: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请输入正确的身份证号',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 18,
                            message: '长度在 1 到 18 个字符',
                            trigger: 'blur'
                        }
                    ],
                    agent_email: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入邮箱',
                            trigger: 'blur'
                        }
                    ],
                    settle_bank_account_name: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入持卡人名',
                            trigger: 'blur'
                        }
                    ],
                    settle_bank_branch: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入开户支行',
                            trigger: 'blur'
                        }
                    ],
                    payment_amount: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入缴费金额',
                            trigger: 'blur'
                        }
                    ],
                   /* referee_tel: [
                        {
                            required: true,
                            validator: checkTel1,
                            message: '请输入推荐人手机号',
                            trigger: 'blur'
                        }
                    ],*/
                  /*  remit_img: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请上传打款截图',
                            trigger: 'blur'
                        }
                    ]*/
                },
            }
        },
        methods: {
            /**
             * 验证手机号
             */
            checkTel(){
                let tel = /^1(3|4|7|5|6|9|8)([0-9]{9})$/;
                if(this.form.referee_tel){
                    if (!tel.test(this.form.referee_tel)) {
                        this.$message('请输入正确的推荐人手机号');
                        return false;
                    }
                }
            },
            //获取省市区
            getCitys(id) {
                return this.$axios.get('/admin/city/province?areaParentId='+id)
            },
            //选择省市区
            handleCtChange(value) {
                console.log('选择省市的', value,this.form.choCity);
                this.form.province_code = value[0];
                this.form.city_code = value[1];
                if(!value[2]){
                    this.form.area_code = '0'
                }else {
                    this.form.area_code = value[2]
                }
            },
            //选择省市区
            handleCtChangeAc(val) {
                console.log("选中", val)
                if (val.length == 1) {
                    // 如果点击的是一级分类
                    let parentId = val[0]
                    this.cityList.map((item, index) => {
                        if (item.id === parentId && item.citys.length === 0) {
                            // 当顶级分类的的child为空时才请求数据
                            this.getCitys(parentId).then(res => {
                                console.log("对奥用", index, res)
                                this.$set(this.cityList[index], 'citys', res.data.data)
                                item.citys.map((innerItem, innerIndex) => {
                                    // 二级分类下要设置一个空的citys数组，不然点击@active-item-change没反应
                                    this.$set(item.citys[innerIndex], 'citys', [])
                                })
                            })
                        }
                    })
                } else if (val.length == 2) {
                    let parentId = val[1]
                    this.cityList.map((item, index) => {
                        item.citys.map((innerItem, innerIndex) => {
                            if (innerItem.id === parentId && innerItem.citys.length === 0) {
                                // 当二级分类的的child为空时才请求一次数据
                                this.getCitys(parentId).then(res => {
                                    this.$set(item.citys[innerIndex], 'citys', res.data.data)
                                });
                                console.log('innner', innerItem)
                            }
                        })
                    })
                }
            },
            //获取省市区
            getCity(id){
                console.log("aaa",id);
                //获取省市区
                this.$axios.get('/admin/city/province?areaParentId='+id)
                    .then(res => {
                        this.cityList = res.data.data;
                        for (let i = 0; i < this.cityList.length; i++) {
                            this.$set(this.cityList[i], 'citys', []);
                        }
                        console.log('获取省市区', res)

                    })
                    .catch(rej => console.log('省市区失败', rej))
            },
            //获取token
            getToken(id){
                console.log("aaa",id);
                this.$axios.post('/admin/file/getUploadAuth')
                    .then(res=>{
                        this.qn.token = res.data.data.file_upload_auth;
                        console.log("获取token",res)
                    })
                    .catch(rej=>{
                        console.log("失败",rej)
                    })
            },
            /**
             * 获取激活码列表
             */
            getLevelList() {
                this.$axios.post('/admin/sys/getLevel').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.levelList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
            /**
             *  上传成功
             */
            handleAvatarSuccess(res, file) {
                this.form.remit_img = URL.createObjectURL(file.raw);
                this.form.store_logo = this.$webConfig.apiHosts + this.qn.key;
            },
            /**
             *  上传前判断
             */
            beforeAvatarUpload(file) {
                this.qn.key = new Date().getTime()+file.name;  //上传到七牛的key
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;
                console.log("获取token成功",this.qn);
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                let tel = /^1(3|4|7|5|6|9|8)([0-9]{9})$/;
                if(this.form.referee_tel){
                    if (!tel.test(this.form.referee_tel)) {
                        this.$message('请输入正确的推荐人手机号');
                        return false;
                    }
                }
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.submitState = true;
                        this.$axios.post('/admin/agent/add',this.form).then(res => {
                            console.log(res);
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message('开通成功');
                                this.$router.push('/agent/list');
                            }else {
                                this.$message(res.data.message);
                            }
                            this.submitState = false;
                        }).catch(()=>{
                            this.submitState = false;
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        },
        mounted() {
            // 获取等级列表
            this.getLevelList();
            // 获取省列表
            this.getCity(1);
        }
    }
</script>

<style>
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
</style>

