<template>
  <div class="update-password">
    <el-card class="update-password-card">
      <div slot="header" class="card-header">
        修改密码
      </div>
      <el-form ref="dataForm" :model="dataForm" :rules="dataRule" class="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="用户名">
          <span>{{ adminInfo.username }}</span>
        </el-form-item>
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
            <el-button @click="resetForm('dataForm')">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit('dataForm')">确定</el-button>
        </span>
    </el-card>
  </div>
</template>

<script>
import {updatePassword} from "@/api/admin/admin";

export default {
  name:'UpdatePassword',
  created() {
    this.init()
  },
  computed:{
    adminInfo(){
      return this.$store.getters.adminInfo
    }
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
      // 初始化清空表单内容
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交，回到登录界面
    dataFormSubmit(dataForm) {
      // TODO: 表达提交逻辑待完成
      this.$refs[dataForm].validate((valid) => {
        if (valid) {
          updatePassword({
            username: this.adminInfo.username,
            password: this.dataForm.password,
            newPassword: this.dataForm.newPassword
          }).then(resp => {
            if(resp.data.code === 200){
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
  /*height: calc(100vh - 169px);*/
  /*height: 470px;*/
  border-radius: inherit;
}
.update-password-card{
  height: 470px;
  /*width: 50%;*/
  /*text-align: left;*/
  /*margin: 25px auto;*/
  /*position: relative;*/
}
.card-header{
  font-size: 18px;
  color: #333;
  cursor: pointer;
}
.dataForm{
  width: 50%;
  margin: 0 auto;
}
.update-password-card .card-footer{
  display: inline-block;
  text-align: center;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
