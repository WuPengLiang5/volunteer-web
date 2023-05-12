<template>
  <div class="register-page white">
    <div class="tab-bar">志愿者注册</div>
    <div class="register-form">
      <div class="register-wrap">
        <el-form :model="registerForm" label-width="85px" :rules="rules" ref="registerForm">
          <h2 class="subtitle">账号信息</h2>
          <el-form-item label="用户名" prop="username">
            <el-input prefix-icon="el-icon-user-solid" v-model="registerForm.username" placeholder="请输入用户名" maxlength="20"></el-input>
            <div class="" style="position: absolute;top: 0;right: -20px;">
              <el-popover
                placement="right"
                title="用户名设置规则："
                width="200"
                trigger="hover"
                content="可使用 6-30 个字母、数字、下划线、减号或其组合，只能以字母开头且用户名不可更改">
                <i slot="reference" class="el-icon-info"></i>
              </el-popover>
            </div>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" prefix-icon="el-icon-s-goods" v-model="registerForm.password" placeholder="请输入密码" maxlength="30" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeatPwd">
            <el-input type="password" prefix-icon="el-icon-s-goods" v-model="registerForm.repeatPwd" placeholder="请输入确认密码" maxlength="30" show-password></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input prefix-icon="el-icon-s-goods" v-model="registerForm.phone" placeholder="请输入手机号码" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verifyCode" class="verify_code">
            <el-row>
              <el-col :span="16">
                <div class="item-verify">
                  <el-input v-model="registerForm.verifyCode" placeholder="请输入验证码" class="verify-code" clearable></el-input>
                </div>
              </el-col>
              <el-col :offset="1" :span="7">
                <div class="item-change">
                  <img v-bind:src="verifyCode" alt="点击切换" @click="handleCodeChange()" >
                </div>
              </el-col>
            </el-row>
          </el-form-item>

          <h2 class="subtitle">基本信息</h2>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="registerForm.name" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="idNumber">
            <el-input v-model="registerForm.idNumber" placeholder="请输入身份证号码" @blur="getIdNumberInfo(registerForm.idNumber)" maxlength="18"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <div class="gender">
              <el-radio v-model="registerForm.gender" disabled label="男">男</el-radio>
              <el-radio v-model="registerForm.gender" disabled label="女">女</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="政治面貌" prop="politic">
            <el-select v-model="registerForm.politic" placeholder="请选择">
              <el-option
                v-for="item in politics"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职业" prop="occupation">
            <el-select v-model="registerForm.occupation" placeholder="请选择">
              <el-option
                v-for="item in occupations"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地" prop="location">
            <el-input v-model="registerForm.location" placeholder="请输入所在地" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="registerForm.address" placeholder="请输入详细地址" maxlength="20"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="register-bottom">
        <el-button type="primary" @click="onSubmit('registerForm')">注册成为志愿者</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {validPhone} from "@/utils/validate";
import {locations} from "./locations";


export default {
  name: "Register",
  data(){
    const checkPhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号码!'));
      }
      if (value === '') {
        callback(new Error('手机号不能为空'))
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    };
    const checkUserName = (rule, value, callback) => {
      const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/;
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (!reg.test(value)) {
        callback(new Error('用户名仅支持6-20位字母、英文、数字、下划线和减号组合，以字母开头。'))
      } else {
        callback()
      }
    };
    return{
      registerForm:{
        username:'',
        password:'',
        repeatPwd:'',
        verifyCode: '',

        name:'',
        idNumber:'',
        gender:'',
        politic:'',
        occupation:'',
        location:'',
        address:''
      },
      rules:{
        username: [
          { required: true, validator:checkUserName, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { pattern:/^\w{6,24}$/, message: '6至24个字符'}
        ],
        repeatPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator:checkPhone, trigger: 'blur' },
        ],
        verifyCode: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ],
        //
        // name: [
        //   { required: true, message: '真实姓名不能为空', trigger: 'blur' },
        // ],
        // gender: [
        //   { required: true, message: '姓名不能为空', trigger: 'blur' }
        // ],
        idNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          {
            pattern: /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: '请输入正确的身份证号'
          },
        ],
        // politic: [
        //   { required: true, message: '政治面貌不能为空', trigger: 'blur' },
        // ],
        // occupation: [
        //   { required: true, message: '职业不能为空', trigger: 'blur' }
        // ],
        // location: [
        //   { required: true, message: '所在地不能为空', trigger: 'blur' }
        // ],
        // address: [
        //   { required: true, message: '详细地址不能为空', trigger: 'blur' },
        // ],
      },
      verifyCode:'http://localhost:8081/api/v1.0/out/verifyCode?random=1',
      politics: [
        {value: '中共党员', label: '中共党员'},
        {value: '中共预备党员', label: '中共预备党员'},
        {value: '共青团员', label: '共青团员'},
        {value: '群众', label: '群众'},],
      occupations:[
        {value: '学生', label: '学生'},
        {value: '农民', label: '农民'},
        {value: '工人', label: '工人'},
        {value: '职员', label: '职员'},
        {value: '国家公务员', label: '国家公务员'},
        {value: '教师', label: '教师'},
        {value: '自由职业者', label: '自由职业者'},
        {value: '个体经营者', label: '个体经营者'},
        {value: '其他', label: '其他'},],
      locations
    }
  },
  methods:{
    getIdNumberInfo(idNumber){
      let val = idNumber.length;
      let sex = null;
      let myDate = new Date();
      let month = myDate.getMonth() + 1;
      let day = myDate.getDate();
      let age = 0;

      if(val===18){
        age = myDate.getFullYear() - idNumber.substring(6, 10) - 1;
        sex = idNumber.substring(16,17);
        if (idNumber.substring(10, 12) < month
          || idNumber.substring(10, 12) === month && idNumber.substring(12, 14) <= day)
          age++;
      }

      if(val===15){
        age = myDate.getFullYear() - idNumber.substring(6, 8) - 1901;
        sex = idNumber.substring(13,14);
        if (idNumber.substring(8, 10) < month
          || idNumber.substring(8, 10) === month && idNumber.substring(10, 12) <= day)
          age++;
      }

      if(sex%2 === 0)
        sex = 2
      else
        sex = 1
      this.registerForm.gender = sex === 1?'男':'女'
      // this.ruleForm.age = age;
    },
    handleCodeChange() {
      let verifyCodeUrl = this.verifyCode;
      let url = verifyCodeUrl.split('=')[0];
      url += "=" + Math.random();
      this.verifyCode =  url;
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method:'post',
            url:'/user/register',
            data:this.registerForm
          }).then(resp=>{
            if (resp.data.code === 200){
              this.$message.success(resp.data.msg)
              this.$router.push("/")
            }
          })
        }
      });
    }
  }
}
</script>

<style scoped>
.register-page{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-top: 20px;
}
.tab-bar{
  background: #fff0f1;
  height: 50px;
  font-size: 16px;
  text-align: left;
  line-height: 50px;
  padding-left: 25px;
}
.register-form{
  padding:0 20px;
}
.register-wrap{
  width: 41%;
}
.register-wrap h2{
  font-size: 20px;
  text-align: left;
  font-weight: bold;
  line-height: 60px;
  padding-left: 20px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}
.register-wrap h2:first-child{
}
.subtitle{
  position: relative;
}
.subtitle:before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 20px;
  background: #e60012;
  position: absolute;
  left: 0;
  top: 50%;
  margin-top: -10px;
}
.register-wrap .item-verify{
  /*width: 50%;*/
  /*float: left;*/
}
.register-wrap .item-change{
  /*margin-left: 10px;*/
  cursor: pointer;
  border: 1px solid rgb(223, 223, 223);
  text-align: center;
  height: 40px;
  border-radius: 4px;
  /*float: right;*/
}
.register-wrap .item-change img{
  /*width: 140px;*/
  /*height: 42px;*/
  width: 100%;
  height: 100%;
}
.register-wrap .gender{
  position: absolute;
  left: 10px;
}
.register-wrap .el-select{
  width: 280px;
  position: absolute;
  left: 0;
}
.register-bottom{
  width: 50%;
  margin-bottom: 20px;
  text-align: center;
}
</style>
