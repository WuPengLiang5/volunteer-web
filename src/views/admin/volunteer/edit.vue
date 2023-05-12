<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
<!--      <div class="createPost-main-container">-->

<!--      </div>-->
      <el-form-item label="姓名" prop="name">
        <el-input v-model="postForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="postForm.address"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="postForm.gender"></el-input>
      </el-form-item>
      <el-form-item label="政治面貌">
        <el-input v-model="postForm.idNumber"></el-input>
      </el-form-item>
      <el-form-item label="职业">
        <el-input v-model="postForm.politic"></el-input>
      </el-form-item>
      <el-form-item label="所在地">
        <el-input v-model="postForm.occupation"></el-input>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="postForm.location"></el-input>
      </el-form-item>

<!--      <el-form-item label="">-->
<!--        <el-input v-model="postForm.name"></el-input>-->
<!--      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>

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
        // image_uri: [{ validator: validateRequire }],
        // title: [{ validator: validateRequire }],
        // content: [{ validator: validateRequire }],
        // source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
}
</script>

<style lang="scss" scoped>
.createPost-container{
  position: relative;
}
</style>
