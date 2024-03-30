<template>
  <div class="login-page">
    <div class="row w login">
        <h2 class="login-header">志愿者登录</h2>
        <div class="login-wrap">
          <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" class="login-form">
            <el-form-item label="" prop="username">
              <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username" placeholder="请输入用户名" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" prefix-icon="el-icon-s-goods" v-model="loginForm.password" placeholder="请输入密码" maxlength="30" show-password></el-input>
            </el-form-item>
            <el-form-item prop="verifyCode" class="verify_code">
              <div class="item-verify">
                <el-input v-model="loginForm.verifyCode" placeholder="请输入验证码" class="verify-code" clearable></el-input>
              </div>
              <div class="item-change">
                <img v-bind:src="verifyCode" alt="点击切换" @click="handleCodeChange()" >
              </div>
            </el-form-item>
          </el-form>
          <el-button class="login-button" @click="onSubmit('loginForm')">登录</el-button>
          <div class="row w login-footer">
            <a>立即注册</a>
            <a>忘记密码？</a>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return {
      // backMsg: '',
      verifyCode:'http://localhost:8081/api/v1.0/out/verifyCode?random=' + Math.random(),
      loginForm:{
        username:'123',
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
  computed: {

  },
  methods:{
    handleCodeChange() {
      let verifyCodeUrl = this.verifyCode;
      let url = verifyCodeUrl.split('=')[0];
      url += "=" + Math.random();
      this.verifyCode =  url;
    },
    onSubmit(formName){
      // var postData=new URLSearchParams()
      // postData.append("username",this.loginForm.username)
      // postData.append("password",this.loginForm.password)
      // postData.append("verifyCode",this.loginForm.verifyCode)
      console.log(this.loginForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const _this = this
          this.$axios({
            method:'post',
            url:'/api/v1.0/out/user/doLogin',
            data:this.loginForm
          }).then(resp => {
            if (resp.data.code===200){
              const userInfo = resp.data.data
              this.$store.dispatch('user/login',{"info":userInfo,"identity":"user"})
              this.$router.push("/")
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
.login-page{
  width: 500px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 28px;
  padding-bottom: 35px;
  background-color: #ffffff;
}
.login{
  box-shadow: 0 10px 20px #ddd;
  height: 460px;
}
.row{
  display: table;
  table-layout: fixed;
  box-sizing: border-box;
}
.login-header{
  text-align: center;
  position: relative;
}
.login h2 {
  font-size: 24px;
  color: #e60012;
  padding: 24px 0;
  text-align: center;
  font-weight: normal;
  border-bottom: 1px solid #eee;
  margin:0 0 40px 0;
}
.login-wrap{
  padding: 0 40px;
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
.login-button{
  background: #e60012;
  width: 100%;
  height: 48px;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  margin-bottom: 20px;
}
.login-footer{
  font-size: 15px;
}
.login-footer a{
  padding: 0 15px;
  cursor: pointer;
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
