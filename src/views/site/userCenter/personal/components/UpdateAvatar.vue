<template>
  <div class="update-avatar">
    <el-upload
        class="avatar-uploader"
        :class="!imageUrl?'avatar-uploader-border':''"
        ref="coverUpload"
        action=""
        :headers="headerObj"
        :show-file-list="false"
        :multiple="false"
        list-type="picture"
        :before-upload="beforeAvatarUpload">
      <el-image v-if="imageUrl" class="avatar" :src="imageUrl" fit="cover" alt="更换头像"></el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
    <el-button size="small" type="success" @click="submitUpload">保存修改</el-button>
  </div>
</template>

<script>
import {updateAvatar} from "@/api/admin/user";
import {fetchVolunteerInfo} from "@/api/admin/volunteer";

export default {
  name: "UpdateAvatar",
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
  },
  data(){
    return {
      imageUrl:'',
      headerObj:{
        token:this.$store.getters.userInfo?this.$store.getters.userInfo.token:null
      },
      uploadFile:''
    };
  },
  created() {
    this.fetchData()
  },
  methods:{
    async fetchData(){
      await fetchVolunteerInfo().then(resp => {
        let avatar = resp.data.data.avatar
        if (avatar){
          this.imageUrl = avatar
        }else{
          this.imageUrl = require('@/assets/user/defaultAvatar.svg')
        }

        // console.log(this.imageUrl.indexOf('http://localhost:8081') >=0,this.imageUrl.indexOf('base64') >= 0)
      })
    },
    // handleAvatarSuccess(res) {
    //   if (res.code === 200){
    //     this.imageUrl = res.data
    //   }
    //   this.$refs.coverUpload.clearFiles()
    // },
    beforeAvatarUpload(file) {
      let types = ['image/jpeg', 'image/jpg', 'image/png'];
      const isImage = types.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图片只能是 JPG、JPEG、PNG 格式!');
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // console.log('file 转 base64结果：' + reader.result)
        this.imageUrl = reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }

      this.uploadFile = file

      return false
    },
    submitUpload(){
      // console.log(this.uploadFile)
      if (this.uploadFile === ''){
        let file = new File([], this.imageUrl, undefined)
        this.uploadFile = file
        // console.log(this.uploadFile)
      }
      let formData = new FormData()
      formData.append("userId",this.userInfo.id)
      formData.append("file",this.uploadFile)
      updateAvatar(formData).then(resp => {
        if (resp.data.code === 200){
          this.$message.success(resp.data.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
.update-avatar{
  position: relative;
  margin: 10px;
  width: 122px;
  /*height: 122px;*/
  /*background-color: #999;*/
  cursor: pointer;
}
.update-avatar .avatar-uploader{
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-border{
  border: 1px dashed #d9d9d9;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 122px;
  height: 122px;
  line-height: 122px;
  text-align: center !important;
}
.el-upload__tip{
  cursor: auto;
}
.avatar {
  width: 122px;
  height: 122px;
  display: block;
}
.update-avatar button{
  width: 120px;
  font-size: 14px;
  margin-top: 10px;
}
</style>
