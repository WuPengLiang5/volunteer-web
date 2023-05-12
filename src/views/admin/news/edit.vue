<template>
  <div class="createPost-container">
    <div class="createPost-container-title">
      编辑新闻
    </div>
    <div class="createPost-container-form">
      <el-form ref="postForm" :model="postForm" :rules="rules"
               label-width="150px">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入新闻标题"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="新闻详情" prop="content" style="min-height: 100px">
              <MyQuillEditor :quill-content="this.postForm.content" @editorChange="editorChange"></MyQuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="来源" prop="source">
          <el-input v-model="postForm.source" placeholder="请输入新闻来源"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="15">
            <el-form-item label="类型" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="newsType">
                    <el-cascader
                      v-model="postForm.newsType"
                      :options="newsTypes"
                      @change="handleChange"
                      :props="optionProps">
                    </el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="新闻封面" prop="cover">
          <el-row>
            <el-col :span="12">
              <el-upload
                ref="coverUpload"
                class="avatar-uploader"
                action="/upload/uploadImage"
                :headers="headerObj"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :multiple="false"
                list-type="picture"
                :before-upload="beforeAvatarUpload"
                :on-success="handleAvatarSuccess">
                <el-button style="margin-left: 10px;" size="small" type="success">选择上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-image v-if="previewImgURL!==''" style="width: 200px; height: 200px" :src="previewImgURL" fit="cover"></el-image>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="examine('postForm')">审核</el-button>
          <el-button type="primary" @click="saveForm('postForm')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {fetchNews, updateNews} from "@/api/news";
import MyQuillEditor from '@/components/MyQuillEditor'
import {deepClone} from "@/utils";

const defaultForm = {
  id: '',
  title: '',
  content: '',
  source: '',
  newsType:'',
  cover:'',

  state:''
}
export default {
  name: "edit",
  components:{
    MyQuillEditor
  },
  data(){
    return {
      postForm:Object.assign({}, defaultForm),
      rules: {
        title: [{required:true,message:'新闻标题不能为空',trigger:'blur'}],
        content: [{ required:true,message:'新闻内容不能为空',trigger:'blur' }],
        source: [{required:true,message:'新闻来源不能为空',trigger:'blur'}],
        newsType: [{ required:true,message:'新闻类型不能为空',trigger:'blur' }],
      },
      newsTypes:[
        {
        id:'7F85C9768A27475E873022A2E1392BCA',
        pid:-1,
        type:2,
        title:'志愿风采',
        url:'/site/news',
        children:[
          {id:'C17A23BD925143D595A31203A5C7F6DD',pid:'7F85C9768A27475E873022A2E1392BCA',type:1,title:'志愿者',list:[]},
          {id:'77A3DB00B0ED4DD785D158FFA2301685',pid:'7F85C9768A27475E873022A2E1392BCA',type:1,title:'志愿活动',list:[]}
        ]
      },
        {
          id:'23E580EE02514E078F5C636E3EE56385',
          pid:-1,
          type:2,
          title:'通知公告',
          url:'/site/news',
          children: []
      }
      ],
      optionProps: {
        value: 'id',
        label: 'title',
        children: 'children'
      },
      previewImgURL:'',
      headerObj:{
        token:this.$store.getters.adminInfo?this.$store.getters.adminInfo.token:null
      }
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    this.fetchData(id)
    this.newsTypes = this.getTreeData(deepClone(this.newsTypes))
  },
  methods:{
    fetchData(id){
      fetchNews({id:id}).then(resp => {
        if (resp.data.code === 200){
          this.postForm = resp.data.data
          if (this.postForm.newsType){
            this.postForm.newsType = this.postForm.newsType.split(',')
          }
          this.previewImgURL = this.postForm.cover
        }
      })
    },
    getTreeData(data){
      // 循环遍历json数据
      if (data){
        for(let i=0; i<data.length; i++){
          if(data[i].children && data[i].children.length < 1){
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          }else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].children);
          }
        }
      }

      return data;
    },
    editorChange(data){
      this.postForm.content = data
    },
    handleChange(value){
      // console.log(value,this.postForm.newsType)
      this.postForm.newsType = value.toString()
    },
    // 上传封面之前
    beforeAvatarUpload (file) { // 大小、格式限制
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
    // 上传成功后
    handleAvatarSuccess (res) {
      console.log(res)
      if (res.code === 200){
        this.previewImgURL = res.data
        this.postForm.cover = res.data
      }
      this.$refs.coverUpload.clearFiles()
    },
    examine(formName){
      this.postForm.state = 1
      this.saveForm(formName)
    },
    saveForm(formName) {
      console.log(this.postForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postForm.newsType = this.postForm.newsType.toString()
          updateNews(this.postForm).then(resp => {
            if (resp.data.code === 200){
              this.$message({
                type: "success",
                message:resp.data.msg
              })
              this.$store.dispatch('tagsView/delVisitedView', this.$route);
              this.$router.push("/admin/news")
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
        this.$router.push("/admin/news")
      }).catch(() => {
        this.$message({
          type: "info",
          message: "成功取消"
        })
      })
    },
  }
}
</script>

<style scoped>
.createPost-container-title{
  text-align: center;
  position: relative;
  top: 0;
  left: 0;
  min-height: 39px;
  line-height: 39px;
  padding: 5px 15px;
  border-width: 0 0 1px;
  border-bottom: 1px solid #d8dce5;
  font-size: 14px;
}
.createPost-container-form{
  margin-top: 15px;
  margin-right: 150px;

  overflow: auto;
}
</style>
