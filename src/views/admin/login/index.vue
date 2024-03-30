<template>
  <div class="app-container">
    <div class="admin-login-background">
      <div class="admin-header">
        <span>志愿服务后管理系统</span>
      </div>
      <div class="login-wrap">
        <el-form class="login-form" ref="loginForm" :model="loginForm" :rules="rules" label-width="80px">
          <el-form-item label="" prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" prefix-icon="el-icon-s-goods" v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item prop="verifyCode" class="verify_code">
            <div class="item-verify">
              <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" class="verify-code" clearable></el-input>
            </div>
            <div class="item-change">
              <img v-bind:src="verifyCodeImg" alt="点击切换" @click="handleCodeChange()" >
            </div>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onSubmit('loginForm')">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      verifyCodeImg:'http://localhost:8081/api/v1.0/out/verifyCode?random=' + Math.random(),
      loginForm:{
        username:'admin1',
        password:'123456',
        verifyCode: ''
      },
      rules:{
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    handleCodeChange() {
      let verifyCodeUrl = this.verifyCodeImg;
      let url = verifyCodeUrl.split('=')[0];
      url += "=" + Math.random();
      this.verifyCodeImg =  url;
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method:'post',
            url:'/api/v1.0/out/admin/doLogin',
            data:this.loginForm,
          }).then(resp => {
            if (resp.data.code === 200){
              const adminInfo = resp.data.data
              this.$store.dispatch('user/login',{"info":adminInfo,"identity":"admin"})
              // this.$message.success("登录成功！")
              this.$router.push("/admin/home")
            }else {
              this.handleCodeChange()
            }
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.app-container{
  width: 100vw;
  /*height: 722px;*/
  height: 100vh;
  position: relative;
  background: url("~@/assets/admin/bg.jpg") no-repeat top center;
  background-size: 100% 100%;
  text-align: center;

  display: flex;
  align-items: center;
  justify-content: center;
}
.admin-login-background {
  /*position: absolute;*/
  /*left: 50%;*/
  /*top: 50%;*/
  /*transform: translate(-50%,-50%);*/
  /*margin: 0 auto;*/
  /*width: 50%;*/
}
.admin-header {
  text-align: center;
  margin-bottom: 20px;
  color: #ffffff;
  font-weight: bold;
  font-size: 40px;
}
.login-wrap{
  padding: 35px;
  border-radius: 6px;
  border: 1px solid #afa7dc;
  background: #f1f1f1;
  box-shadow: 0 0 6px #afa7dc;
}
.login-wrap .verify_code .item-verify{
  width: 60%;
  float: left;
}
.login-wrap .verify_code .item-change{
  margin-left: 10px;
  cursor: pointer;
  border: 1px solid rgb(223, 223, 223);
  text-align: center;
  width: 35%;
  height: 46px;
  border-radius: 4px;
  float: right;
}
.item-change img{
  width: 100%;
  height: 48px;
}
</style>
<style>
.login-wrap .login-form .el-form-item{
  margin-bottom: 25px;
}
.login-form .el-form-item .el-form-item__content{
  margin-left: 0 !important;
}
.login-form .el-form-item .el-form-item__content .el-input input{
  height: 48px;
}
</style>
