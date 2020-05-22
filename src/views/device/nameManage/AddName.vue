<template>
  <div>
    <div class="main-right" id="main-right" :style="{height: (getWinHeight-60) + 'px'}">
      <div class="main-content" id="main-content" :style="{height: (getWinHeight-60)+'px'}">
        <div class="main-feature">
          <div class="main-inner">
            <h1 class="ly-title-one" style="margin-bottom: 20px">添加设备名称</h1>
            <!--搜索条件 start -->
            <div class="form-list" style="margin-top: 30px;" v-loading="loading">
              <el-form :model="form" label-width="100px" ref="form" :rules="rules">
                <!--<div class="line">基本信息</div>-->
                <el-form-item label="设备名称:" prop="name">
                  <el-input v-model="form.name" placeholder="请输入设备名称"></el-input>
                </el-form-item>

                <el-form-item label="所属分类:" prop="device_type_id">
                  <el-select v-model="form.device_type_id" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="图片:" prop="cover_img">
                  <el-upload
                    class="avatar-uploader"
                    :action="this.$webConfig.qnUploadHost"
                    :data="qn"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img v-if="form.cover_img" :src="form.cover_img" class="avatar" @click="getToken()" />
                    <i v-else class="el-icon-plus avatar-uploader-icon" @click="getToken()"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit('form')" size="small">添加</el-button>
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
import CommonFooter from "../../../components/CommonFooter.vue";

export default {
  name: "addName",
  components: {
    CommonFooter
  },
  computed: {
    getWinHeight: function() {
      return this.$winHeight;
    }
  },
  data() {
    var checkNull = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error());
      } else {
        callback();
      }
    };
    return {
      winHeight: window.innerHeight,
      loading: false,
      qn: {
        token: "",
        key: ""
      },
      form: {
          device_type_id:'', //设备id
          name:'',//设备名称
          cover_img:'', //设备图片
      },
      options: [],
      rules: {
        name: [
          {
            required: true,
            validator: checkNull,
            message: "请输入设备名称",
            trigger: "blur"
          }
        ],
        device_type_id: [
          {
            required: true,
            message: "请选择所属分类",
            trigger: "blur"
          }
        ],
        cover_img:[
              {
            required: true,
            message: "请选择图片",
          }
        ]
      }
    };
  },
  methods: {
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
     *  上传成功
     */
    handleAvatarSuccess(res, file) {
    //   let ver_img = URL.createObjectURL(file.raw);
      this.form.cover_img = this.$webConfig.apiHosts + this.qn.key;
        console.log('获取文件',res,file)

    },
    /**
     *  上传前判断
     */
    beforeAvatarUpload(file) {
      this.qn.key = new Date().getTime() + Math.floor(Math.random()*10); //上传到七牛的key
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      console.log("获取token成功", this.qn);
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/JPEG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    onSubmit(formName) {
      console.log("submit!", this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$axios
            .post("/admin/device/name/add", this.form)
            .then(res => {
              this.loading = false;
              console.log("添加结果", res);
              if (res.data.code == 200) {
                this.$message.success("添加成功");
                this.$router.go(-1);
              } else {
                this.$message.error(res.data.message);
              }
            })
            .catch(rej => {
              this.loading = false;
              this.$message.error("网络异常!");
              console.log("失败", rej);
            });
        }
      });
    }
  },
  created() {
      //获取分类
       this.$axios.get("/admin/device/type/pull/down/list")
       .then(res=>{
           console.log('获取分裂',res)
           if(res.data.code == 200){
               this.options = res.data.data
           }
       })
       .catch(rej=>{
           this.$message.error("网络异常!");
           console.log('获取失败',rej)
       })
  }
};
</script>

<style>
.main-inner {
  padding: 13px 40px;
}

.line {
  width: 100%;
  font-size: 18px !important;
  color: #333;
  margin-bottom: 20px;
}

.home-title-t {
  font-size: 18px;
  padding-left: 10px;
  color: #333;
}

.tip {
  font-size: 12px;
  color: #909090;
  line-height: 26px;
}

input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
  width: 200px;
  height: auto;
  display: block;
}
</style>
