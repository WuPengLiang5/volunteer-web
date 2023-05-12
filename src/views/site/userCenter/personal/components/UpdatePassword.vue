<template>
  <div class="update-password">
    <div class="update-password-card">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-position="left" @keyup.enter.native="dataFormSubmit('dataForm')" label-width="100px">
        <el-form-item label="原密码" prop="password">
          <el-input type="password" v-model="dataForm.password" placeholder="原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="dataForm.newPassword" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="dataForm.confirmPassword" placeholder="确认密码"></el-input>
        </el-form-item>
      </el-form>
      <span class="card-footer">
            <el-button type="danger" @click="dataFormSubmit('dataForm')">保存修改</el-button>
        </span>
    </div>
  </div>
</template>

<script>
import {updatePassword} from "@/api/user";

export default {
  name:'UpdatePassword',
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  created() {
    this.init()
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    return {
      loginName: '',
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        password: [{
          required: true,
          message: '原密码不能为空',
          trigger: 'blur'
        }],
        newPassword: [{
          required: true,
          message: '新密码不能为空',
          trigger: 'blur'
        }],
        confirmPassword: [{
          required: true,
          validator:validatePass,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    // 初始化
    init() {
      // this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    dataFormSubmit(dataForm) {
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          updatePassword({
            username: this.userInfo.username,
            password: this.dataForm.password,
            newPassword: this.dataForm.newPassword
          }).then(resp => {
            if (resp.data.code === 200){
              this.$message({
                type: 'success',
                message: resp.data.msg
              })
              this.init()
            }
          })
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style type="text/css" scoped>
.update-password{
  /*height: calc(100vh - 160px);*/
  height: 475px;
  /*border-radius: inherit;*/
}
.update-password-card{
  width: 50%;
  text-align: left;
  margin: 25px 10px;
  position: relative;
}
.update-password-card .card-footer{
  display: inline-block;
  text-align: center;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
