<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight) + 'px'}">
            <div class="main-white-list">
                <el-card class="white-list-box">
                    <h2>测试账号IP白名单设置</h2>
                    <div class="form-list">
                        <el-form label-position="left" ref="form" :model="form" label-width="130px" :rules="rules">
                            <el-form-item label="您当前的IP">
                                <span>{{form.IP ? form.IP : '--'}}</span>
                            </el-form-item>
                            <el-form-item label="IP白名单" prop="ip_limits">
                                <el-input v-model="form.ip_limits" placeholder="请输入" type="textarea" :rows="10"></el-input>
                                <p class="ly_hint_text">注：添加IP时需回车换行，每行被识别为一个IP地址</p>
                            </el-form-item>
                            <el-form-item label="手机号" prop="tel">
                                <div class="ly-flex-end">
                                    <el-radio-group v-model="form.tel">
                                        <el-radio :label="ele" v-for="(ele,i) in phoneList" :key="i">{{ele.replace(/^(\d{3})\d{4}(\d{4})$/, '$1 **** $2')}}</el-radio>
                                    </el-radio-group>
                                    <el-button @click="getCode" style="width: 92px" :disabled="disabled" size="small" type="primary">{{codeBtn}}</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="验证码" prop="code">
                                <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('form')" v-loading="submitState">提交</el-button>
                                <!--<el-button @click="resetForm('form')">重置</el-button>-->
                                <!--<el-button>取消</el-button>-->
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
    import CommonFooter from '../components/CommonFooter.vue'
    let id = 0;
    export default {
        name: "WhiteList",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            var checkNull = (rule, value, callback) => {
                if (value.trim() === '') {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            return {
                submitState: false,
                winHeight: window.innerHeight,
                form: {
                    "tel": '',//手机号
                    "ip_limit": '',//白名单，逗号隔开【数据联调】
                    "ip_limits": '',//白名单，换行隔开
                    "code": '',//验证码
                    "IP": '',
                },
                rules: {
                    ip_limits: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请选择区域',
                            trigger: 'blur'
                        }
                    ],
                    code: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请输入验证码',
                            trigger: 'blur'
                        }
                    ],
                    tel: [
                        {
                            validator: checkNull,
                            required: true,
                            message: '请选择手机号',
                            trigger: 'change'
                        }
                    ]
                },
                phoneList: [],
                codeBtn: '获取验证码',
                disabled: false,
                time: 0,
            }
        },
        methods: {
            //获取验证码
            getCode:function(){
                if(this.form.tel==''){
                    this.$message("请选择手机号");
                    return false;
                }
                this.time = 60;
                this.disabled=true;
                this.timer();
                this.$axios.get('/public/ip/send/code?tel=' + this.form.tel).then(res=>{
                    console.log(res);
                    if(res.data.code==200){
                        this.$message('发送成功');
                        this.code = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                });
            },
            //封装一个函数，获取验证码部分：60s 或 重新发送
            timer:function (){
                if (this.time > 0) {
                    this.time --;
                    this.codeBtn = this.time+"s";
                    setTimeout(this.timer,1000);
                } else{
                    this.time = 0;
                    this.codeBtn = "获取验证码";
                    this.disabled = false;
                }
            },
            /**
             * 获取白名单列表
             */
            getWhiteList() {
                this.$axios.post('/public/ip/whitelist').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.form.ip_limit = res.data.data;
                        this.form.ip_limits = this.form.ip_limit.replace(/\uff0c|[,]/g,"\n");
                        console.log(this.form.ip_limit,this.form.ip_limits)
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.$message.error('网络异常')
                    });
            },
            /**
             * 获取手机号列表
             */
            getPhoneList() {
                this.$axios.post('/public/ip/tel/list').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.phoneList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.$message.error('网络异常')
                    });
            },
            /**
             * 获取ip地址
             */
            getIP() {
                this.$axios.post('/public/ip/get').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.form.IP = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {
                        this.$message.error('网络异常')
                    });
            },
            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.submitState = true;
                        this.form.ip_limit = this.form.ip_limits.replace(/\n/g,",");
                        this.$axios.post('/public/ip/update/whitelist',this.form).then(res => {
                            console.log(res);
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message('提交成功');
                            }else {
                                this.$message(res.data.message);
                            }
                            this.submitState = false;
                        }).catch(()=>{
                            this.submitState = false;
                            this.$message('网络异常');
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
            // 获取手机号列表
            this.getPhoneList();
            // 获取白名单列表
            this.getWhiteList();
            // 获取IP地址
            this.getIP();
        }
    }
</script>

<style>
    .main-white-list {
        width: 100vw;
        height: 100vh;
        background: url(/img/nets.ccce4d74.png) 100% 100%;
        background-size: 100% 100%;
    }
    .white-list-box {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        padding: 30px 40px;
    }
    h2 {
        text-align: center;
        margin-bottom: 50px;
    }
    .form-list .el-radio {
        margin: 10px;
    }
    .form-list .el-input__inner,.form-list .el-textarea__inner {
        width: 100%;
    }
</style>

