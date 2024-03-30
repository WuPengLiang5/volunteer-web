<template>
  <div style="height: 100%">
    <el-card class="box-card" shadow="always">
      <div slot="header" class="card-header">
        <span>个人信息</span>
      </div>
      <el-form ref="formData" :model="formData" class="formData" label-width="120px">
        <el-form-item
          prop="name"
          label="姓名">
          <el-input :disabled="isEdit" v-model="formData.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item
          label="电话"
          prop="phone">
          <el-input :disabled="isEdit" v-model="formData.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email">
          <el-input :disabled="isEdit" v-model="formData.email" placeholder="请输入邮箱"/>
        </el-form-item>
        <el-form-item
          prop="introduction"
          label="个人简介">
          <el-input type="textarea" :disabled="isEdit" v-model="formData.introduction" :autosize="{minRows:5}" placeholder="请输入个人简介"/>
        </el-form-item>
        <el-form-item v-if="!isEdit" align="center">
          <el-button type="primary" :loading="saveStatus" @click="onSubmit()">保存更改</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        <el-form-item v-if="isEdit" align="center">
          <el-button type="primary" @click="edit()">编辑</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {fetchAdminProfile, updateAdmin} from '@/api/admin/admin'
export default {
  computed:{
    adminId(){
      return this.$store.getters.adminInfo?this.$store.getters.adminInfo.id:''
    }
  },
  data(){
    return{
      formData:{},
      role:'',
      isEdit:true,
      saveStatus:false
    }
  },
  created: function(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      console.log(this.adminId)
      fetchAdminProfile(this.adminId).then((resp)=>{
        if (resp.data.code===200){
          console.log(resp.data.data)
          this.formData = resp.data.data;
        }
      })
    },
    edit(){
      this.isEdit=false
    },
    onSubmit(){
      this.saveStatus = true
      updateAdmin(this.formData).then(res=>{
        if (res.data.code===200){
          this.$message({
            type:'success',
            message:res.data.msg
          })
          this.fetchData()
          this.saveStatus = false
          this.isEdit=true
        }
      })
    },
    onCancel(){
      this.fetchData()
      setTimeout(() => {
        this.isEdit=true
      },200)
    },
  }
}
</script>

<style scoped>
.box-card{
  height: calc(100% - 2px);
}
.card-header{
  font-size: 18px;
  color: #333;
  cursor: pointer;
}
.formData{
  margin: 0 auto;
  width: 50%;
}
</style>
