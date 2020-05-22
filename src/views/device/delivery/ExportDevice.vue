<template>
    <div>
        <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
            <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
                <div class="main-feature">
                    <div class="main-inner">
                        <h1 class="ly-title-one" style="margin-bottom: 40px">设备出库</h1>
                        <div class="form-list">
                            <el-form label-position="left" ref="form" :model="form" label-width="130px" :rules="rules">
                                <el-form-item label="设备分类" prop="device_type_id">
                                    <el-select v-model="form.device_type_id" placeholder="请选择设备分类" clearable>
                                        <el-option v-for="item in classifyList"
                                                   :key="item.id"
                                                   :label="item.name"
                                                   :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="设备名称" prop="device_name_id">
                                    <el-select v-model="form.device_name_id" placeholder="请选择设备名称" clearable @focus = "getNameList">
                                        <el-option v-for="item in nameList"
                                                   :key="item.id"
                                                   :label="item.value"
                                                   :value="item.id"></el-option>
                                    </el-select>
                                    <img style="width: 100px;height: 100px;margin: 20px 0 -16px" v-if="nameList[form.name-1]" :src="nameList[form.name-1].url" alt="">
                                </el-form-item>
                                <el-form-item label="出库对象" prop="tel">
                                    <el-input v-model="form.tel" @blur="getName" placeholder="请输入服务商手机号"></el-input>
                                    <p v-if="companyName&&form.tel.length==11" style="line-height: 32px;margin: 0;color:#606266">服务商名： {{companyName}}</p>
                                </el-form-item>
                                <!-- 后续可能会加 start -->
                                <!--<el-form-item label="录入数量" prop="device_num">
                                    <el-input v-model="form.device_num" placeholder="请输入设备录入数量"></el-input>
                                </el-form-item>-->
                                <!-- 后续可能会加 end -->
                                <el-form-item label="设备SN码" prop="device_no">
                                    <div style="position: relative">
                                        <el-input v-model="form.device_no" placeholder="请输入设备SN码"></el-input>
                                        <div class="importBox">
                                            <!--class="upload-demo"-->
                                            <el-upload
                                                    style="margin-right: 10px"
                                                    :limit = limitNum
                                                    accept=".xlsx"
                                                    :action="this.$webConfig.qnUploadHost"
                                                    :data="qn"
                                                    :before-upload="beforeUploadFile"
                                                    :on-remove="fileRemove"
                                                    :on-exceed="exceedFile"
                                                    :on-success="handleSuccess"
                                                    :on-error="handleError"
                                                    :file-list="fileList">
                                                <el-button size="small" type="primary" @click="getToken">批量出库</el-button>
                                                <!--<div slot="tip" class="el-upload__tip">只能上传.xlsx文件，且不超过1M</div>-->
                                            </el-upload>
                                            <el-button type="text" @click="importClick()" class="downBtn">模板下载</el-button>
                                        </div>
                                    </div>
                                    <p class="ly_hint_text">注：若需导入多台设备，可下载模板选择批量导入方式</p>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('form')" v-loading="submitState">提交</el-button>
                                    <!--<el-button @click="resetForm('form')">重置</el-button>-->
                                    <el-button @click="$router.push('/device/storage')">取消</el-button>
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
    import CommonFooter from '../../../components/CommonFooter.vue'
    let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; //手机号
    export default {
        name: "ExportDevice",
        components: {
            CommonFooter
        },
        computed: {
            getWinHeight: function () {
                return this.$winHeight;
            }
        },
        data() {
            var checkSNNull = (rule, value, callback) => {
                if(this.importStatus){
                    callback();
                }else {
                    if (value.trim() === '') {
                        callback(new Error(rule.message));
                    }  else {
                        callback();
                    }
                }
            };
            var checkIdNull = (rule, value, callback) => {
                // console.log(rule,'==',value,'==',callback)
                if (value === '') {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkNum = (rule, value, callback) => {
                let reg2 = /^[1-9]+\d*$/; //不含0，正整数
                if (!reg2.test(value)) {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            var checkTel = (rule, value, callback) => {
                if (!reg.test(value)) {
                    callback(new Error(rule.message));
                }  else {
                    callback();
                }
            };
            return {
                companyName: '',//公司名称
                submitState: false,
                winHeight: window.innerHeight,
                qn: {
                    token: "",
                    key: ""
                },
                form: {
                    "device_type_id": '',
                    "device_name_id": '',
                    // "device_num": '',//录入数量
                    "device_no": '',
                    "tel": '',
                    "agent_subject_id": '',
                },
                rules: {
                    // device_num: [
                    //     {
                    //         validator: checkNum,
                    //         required: true,
                    //         message: '请输入录入数量(大于0的正整数)',
                    //         trigger: 'blur'
                    //     }
                    // ],
                    tel: [
                        {
                            validator: checkTel,
                            required: true,
                            message: '请输入正确的手机号',
                            trigger: 'blur'
                        }
                    ],
                    device_type_id: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择设备分类',
                            trigger: 'change'
                        }
                    ],
                    device_name_id: [
                        {
                            validator: checkIdNull,
                            required: true,
                            message: '请选择设备名称',
                            trigger: 'change'
                        }
                    ],
                    device_no: [
                        {
                            validator: checkSNNull,
                            required: true,
                            message: '请输入SN码',
                            trigger: 'blur'
                        }
                    ],
                    /*  remit_img: [
                          {
                              validator: checkNull,
                              required: true,
                              message: '请上传打款截图',
                              trigger: 'blur'
                          }
                      ]*/
                },
                importStatus: false,//导入状态[真：多个；假：一个]
                classifyList: [
                    /*{
                        id: 1,
                        name: '刷脸'
                    }*/
                ],//分类list
                nameList: [
                    {
                        id: 1,
                        value: 'F4',
                        url: require('../../../assets/img/sc.svg')
                    }
                ],//设备名称list
                limitNum: 1,  // 上传excell时，同时允许上传的最大数
                fileList: [],   // excel文件列表
            }
        },
        methods: {
            /**
             *  模板下载
             */
            importClick(){
                window.location.href='http://files.pay.dianjishenghuo.cn/SN%E8%AE%BE%E5%A4%87%E7%A0%81%E6%A8%A1%E6%9D%BF.xlsx';
            },
            //获取公司名称
            getName(){
                if(!reg.test(this.form.tel)){
                    this.companyName = '';
                    this.form.agent_subject_id = '';
                    return false;
                }
                this.$axios.get('/admin/devices/out/target?tel=' + this.form.tel).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.companyName = res.data.data.value;
                        this.form.agent_subject_id = res.data.data.id;
                    }else {
                        this.$message(res.data.message);
                    }
                }).catch(()=>{

                })
            },
            // 文件超出个数限制时的钩子
            exceedFile(files, fileList) {
                this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`);
            },
            // 文件被移除时的钩子
            fileRemove(file, fileList) {
                console.log('移除');
                console.log(file.raw);
                this.fileList.pop();
                this.form.file = '';
                this.importStatus = false;
                console.log(this.fileList,this.importStatus);
            },
            // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
            beforeUploadFile(file) {
                console.log('before upload');
                console.log(file);
                this.qn.key = new Date().getTime() + Math.floor(Math.random()*10); //上传到七牛的key
                let extension = file.name.substring(file.name.lastIndexOf('.')+1);
                let size = file.size / 1024 / 1024;
                if(extension !== 'xlsx') {
                    this.$message.warning('只能上传后缀是.xlsx的文件');
                }
                if(size > 10) {
                    this.$message.warning('文件大小不得超过10M');
                }
            },
            // 文件上传成功时的钩子
            handleSuccess(res, file, fileList) {
                this.$message.success('文件上传成功');
                this.importStatus = true;
                this.form.file = this.$webConfig.apiHosts + this.qn.key;
                console.log(this.importStatus)
            },
            // 文件上传失败时的钩子
            handleError(err, file, fileList) {
                this.$message.error('文件上传失败');
                console.log(this.importStatus)
            },
            //获取token
            getToken() {
                console.log("aaa");
                this.$axios
                    .post("/admin/file/getUploadAuth")
                    .then(res => {
                        this.qn.token = res.data.data.file_upload_auth;
                        console.log("获取token", res);
                    })
                    .catch(rej => {
                        console.log("失败", rej);
                    });
            },
            /**
             * 提交
             * @param formName
             */
            submitForm(formName) {
                let tel = /^1(3|4|7|5|6|9|8)([0-9]{9})$/;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let api = '';
                        if (this.importStatus) {
                            //    出库多个
                            api = '/admin/devices/out/batch';
                        } else {
                            //    出库一个
                            api = '/admin/devices/out/one'
                        }
                        console.log('submit!',this.importStatus,api);
                        this.submitState = true;
                        this.$axios.post(api,this.form).then(res => {
                            console.log(res);
                            if (res.data.code === this.$webConfig.httpSuccessStatus) {
                                this.$message.success(res.data.data);
                                this.$router.push('/device/delivery');
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
            },

            /**
             * 获取设备分类list
             */
            getClassifyList() {
                this.$axios.get('/admin/device/type/pull/down/list').then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.classifyList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
            /**
             * 获取设备名称list
             */
            getNameList() {
                if(this.form.device_type_id == ''){
                    this.$message('请先选择分类');
                    return false;
                }
                this.$axios.get('/admin/device/name/pull/down/list?device_type_id=' + this.form.device_type_id).then(res => {
                    console.log(res);
                    if (res.data.code === this.$webConfig.httpSuccessStatus) {
                        this.nameList = res.data.data;
                    }else {
                        this.$message(res.data.message);
                    }
                })
                    .catch(() => {

                    });
            },
        },
        mounted() {
            // 获取设备分类list
            this.getClassifyList();
            // 获取设备名称list
            // this.getNameList();
        }
    }
</script>

<style>
    .importBox {
        position: relative;
        /* position: absolute;
         left: 515px;
         top: -1px*/
    }
    .importBox .downBtn {
        position: absolute;
        left: 96px;
        top: 0
    }
</style>

