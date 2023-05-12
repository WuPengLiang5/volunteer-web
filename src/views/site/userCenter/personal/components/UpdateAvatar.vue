<template>
  <div class="update-avatar">
    <el-upload
        class="avatar-uploader"
        ref="coverUpload"
        action="/upload/uploadImage"
        :headers="headerObj"
        :show-file-list="false"
        :multiple="false"
        list-type="picture"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
      <el-image v-if="imageUrl" class="avatar" :src="imageUrl" fit="cover" alt="更换头像"></el-image>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
    <el-button size="small" type="success" @click="submitUpload">保存修改</el-button>
  </div>
</template>

<script>
import {updateAvatar} from "@/api/user";
import {fetchVolunteerInfo} from "@/api/volunteer";

export default {
  name: "UpdateAvatar",
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    },
  },
  data(){
    return {
      imageUrl:this.$store.getters.userInfo?this.$store.getters.userInfo.avatar:require('@/assets/user/defaultAvatar.svg'),
      headerObj:{
        token:this.$store.getters.userInfo?this.$store.getters.userInfo.token:null
      },
      avatar:''
    };
  },
  created() {
    this.fetchData()
  },
  methods:{
    fetchData(){
      fetchVolunteerInfo(this.uid).then(resp => {
        this.avatar = resp.data.data
      })
    },
    handleAvatarSuccess(res) {
      if (res.code === 200){
        this.imageUrl = res.data
      }
      this.$refs.coverUpload.clearFiles()
    },
    beforeAvatarUpload(file) {
      let types = ['image/jpeg', 'image/jpg', 'image/png'];
      const isImage = types.includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图片只能是 JPG、JPEG、PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M && isImage
    },
    submitUpload(){
      updateAvatar({userId:this.userInfo.id,imageUrl:this.imageUrl}).then(resp => {
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
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
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
