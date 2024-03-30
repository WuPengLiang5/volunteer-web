<template>
  <div class="createPost-container">
    <div class="createPost-container-head">
      编辑志愿者信息
    </div>
    <div class="createPost-container-body">
      <el-form ref="postForm" :model="postForm" :rules="rules" label-width="100px" class="form-container">
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <span>{{postForm.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="性别">
              <div class="gender">
                <el-radio v-model="postForm.gender" disabled label="男">男</el-radio>
                <el-radio v-model="postForm.gender" disabled label="女">女</el-radio>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="身份证号码">
              <span>{{postForm.idNumber}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="注册所在地">
              <span>{{postForm.location}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" >
            <el-form-item label="职业" prop="occupation">
              <el-select v-model="postForm.occupation" placeholder="请选择">
                <el-option
                  v-for="item in occupations"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1" prop="politic">
            <el-form-item label="政治面貌">
              <el-select v-model="postForm.politic" placeholder="请选择">
                <el-option
                  v-for="item in politics"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11" prop="address">
            <el-form-item label="详细地址">
              <el-input v-model="postForm.address"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
          </el-col>
        </el-row>
        <el-row type="flex" align="center" justify="center">
          <el-col :span="24" style="margin-left: 30px">
            <el-button type="primary" @click="save">提交</el-button>
            <el-button type="danger" @click="cancel">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>

import {fetchVolunteer, updateVolunteer} from "@/api/admin/volunteer";

const defaultForm = {
  id:'',
  name: '', // 姓名
  gender: '', // 性别
  idNumber: '', // 身份证号码
  politic: '', //政治面貌
  occupation: '', // 职业
  location: '', // 所在地
  address: '', // 详细地址
}

export default {
  name: "edit",
  data(){
    return {
      postForm:Object.assign({},defaultForm),
      rules: {
        politic: [
          { required: true, message: '政治面貌不能为空', trigger: 'blur' },
        ],
        occupation: [
          { required: true, message: '职业不能为空', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
        ],
      },
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
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    this.fetchData(id)
  },
  methods:{
    fetchData(id){
      console.log(id)
      fetchVolunteer({"id":id}).then(resp => {
        if (resp.data.code === 200){
          this.postForm = resp.data.data
          this.getIdNumberInfo(this.postForm.idNumber)
        }
      })
    },
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
      this.postForm.gender = sex === 1?'男':'女'
      // this.ruleForm.age = age;
    },
    save(){
      this.$refs['postForm'].validate(valid => {
        if (valid){
          updateVolunteer(this.postForm).then(resp => {
            if (resp.data.code === 200){
              this.$message.success('更新成功！')
              this.$store.dispatch('tagsView/delVisitedView', this.$route);
              this.$router.push("/admin/volunteer")
            }
          })
        }
      })
    },
    cancel(){
      this.$confirm("确认放弃编辑此文档？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('tagsView/delVisitedView', this.$route);
        this.$router.push("/admin/volunteer")
      }).catch(() => {
        this.$message({
          type: "info",
          message: "成功取消"
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.createPost-container{
  position: relative;
  margin: 20px 35px;
  height: 450px;
}
.createPost-container-head{
  padding: 10px 1px;
  font-family: '微软雅黑', serif;
  font-size: 18px;
}
.createPost-container-body{
  padding-top: 20px;
}
.form-container{
  width: 100%;
}
</style>
