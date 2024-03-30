<template>
  <div class="user-info clearfix">
    <div class="user-info-header">
<!--      用户名：<span>个人信息</span>-->
    </div>
    <div class="user-info-content">
      <el-form ref="formData" :model="formData" class="formData" label-position="left" label-width="82px">
        <el-form-item
          prop="username"
          label="用户名">
          <span>{{formData.username}}</span>
        </el-form-item>
        <el-form-item
          label="手机号"
          prop="phone">
          <el-input v-if="isEdit" v-model="formData.phone" placeholder="请输入手机号"/>
          <span v-else :style="formData.phone?'':'color:red'">{{formData.phone ? formData.phone:'未设置手机号'}}</span>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input v-if="isEdit" v-model="formData.email" placeholder="请输入邮箱"/>
          <span v-else :style="formData.email?'':'color:red'">{{formData.email ? formData.email:'未设置邮箱'}}</span>
        </el-form-item>
        <el-form-item
            prop="name"
            label="姓名">
          <el-input v-if="isEdit" v-model="formData.name" placeholder="请输入姓名"/>
          <span v-else>{{formData.name}}</span>
        </el-form-item>
        <el-form-item
            label="性别"
            prop="gender">
          <el-radio disabled v-model="formData.gender" label="男">男</el-radio>
          <el-radio disabled v-model="formData.gender" label="女">女</el-radio>
        </el-form-item>
        <el-form-item
          label="注册所在地"
          prop="location">
          <span>{{formData.location}}</span>
        </el-form-item>
        <el-form-item
            prop="address"
            label="详细地址">
          <el-input v-if="isEdit" v-model="formData.address" placeholder="请输入详细地址"/>
          <span v-else>{{formData.address}}</span>
        </el-form-item>
        <el-form-item
            label="身份证号"
            prop="idNumber">
          <span>{{formData.idNumber}}</span>
        </el-form-item>
        <el-form-item v-if="isEdit">
          <el-button type="primary" @click="onSubmit()">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        <el-form-item v-if="!isEdit">
          <el-button type="primary" @click="isEdit = true">编辑</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {fetchVolunteerInfo,updateVolunteer} from "@/api/admin/volunteer";
import {updateUserInfo} from "@/api/admin/user";

export default {
  data(){
    return{
      formData:{},
      isEdit:false
    }
  },
  computed:{
    userId(){
      return this.$store.getters.userInfo.id
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      fetchVolunteerInfo().then(resp => {
        this.formData = resp.data.data
        // console.log(this.formData)
      })
    },
    onSubmit(){
      updateUserInfo(this.formData).then(resp => {
        if (resp.data.code === 200){
          this.$message({
            type:'success',
            message:'成功更新个人信息'
          })
          this.fetchData()
          this.isEdit = false
        }
      })
    },
    onCancel(){
      this.isEdit =false
    },
  }
}
</script>

<style scoped>
.user-info{
  padding-left: 14px;
}
.user-info-header{
  font-size: 14px;
  text-align: left;
  padding-bottom: 10px;
}
.user-info-content{

}
.formData{
  width: 50%;
}
</style>
