<template>
  <div class="create-activity">
    <div class="create-activity-title">
      新增公益活动
    </div>
    <div class="create-activity-form">
      <el-form ref="activityForm" :model="form" :rules="rules"
               label-width="150px">
        <el-form-item label="活动名" prop="title">
          <el-input v-model="form.title" placeholder="请输入活动名"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="活动详情" prop="introduction">
              <MyQuillEditor :quill-content="this.form.introduction" @editorChange="editorChange"></MyQuillEditor>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="活动时间" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="beginTime">
                    <el-date-picker type="date" placeholder="开始时间" v-model="form.beginTime" style="width: 100%;"
                                    :editable="false" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">至</el-col>
                <el-col :span="11">
                  <el-form-item prop="endTime">
                    <el-date-picker type="date" placeholder="结束时间" v-model="form.endTime" style="width: 100%;"
                                    :editable="false" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="报名时间" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="registrationBegin">
                    <el-date-picker
                      type="date"
                      placeholder="开始时间"
                      v-model="form.registrationBegin" style="width: 100%;"
                      :editable="false"
                      format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="text-align: center;">至</el-col>
                <el-col :span="11">
                  <el-form-item prop="registrationEnd">
                    <el-date-picker
                      type="date"
                      placeholder="结束时间"
                      v-model="form.registrationEnd"
                      style="width: 100%;"
                      :editable="false"
                      format="yyyy-MM-dd HH:mm:ss">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="15">
            <el-form-item label="活动地点" prop="location">
              <el-input v-model="form.location" placeholder="请输入活动地点"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <i class="el-icon-location" style="font-size: 22px;margin-bottom: 25px;cursor: pointer" @click="getLocation" title="定位"></i>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="活动人数上限" prop="registerMax">
              <el-input v-model="form.registerMax" placeholder="请输入活动人数上限" type="number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="15">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="form.contactPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="活动封面" prop="cover">
          <el-row>
            <el-col :span="12">
              <el-upload
                ref="coverUpload"
                class="avatar-uploader"
                action=""
                :auto-upload="false"
                :headers="headerObj"
                :show-file-list="false"
                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                :multiple="false"
                list-type="picture"
                :before-upload="beforeAvatarUpload"
                :on-change="handleChangeFile">
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
          <el-button type="primary" @click="saveForm('activityForm')">保存</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
<!--    <el-button type="success" @click="getLocation">定位</el-button>-->
    <Map ref="map" :width="'50%'" :dialog-visible="flag" :address="''"  @map-confirm="mapConfirm"  @map-cancel="mapCancel"></Map>
  </div>
</template>

<script>
import {createActivity} from "@/api/admin/activity"
import MyQuillEditor from "@/components/MyQuillEditor/index";
import Map from "@/components/BaiduMap"
import {validPhone} from "@/utils/validate";
import {uploadFile} from "@/api/admin/upload";

export default {
  name: "InsertActivity",
  components:{
    MyQuillEditor,
    Map
  },
  data(){
    const validateEventStare = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择活动开始时间"));
      } else {
        if (this.form.endTime !== "") {
          this.$refs.activityForm.validateField('endTime');
        }
        callback();
      }
    };
    const validateEventEnd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择活动结束时间"));
      } else if (value < this.form.beginTime) {
        callback(new Error("结束时间需晚于开始时间!"));
      } else {
        this.form.endTime = new Date(new Date(this.form.endTime).setHours(23, 59, 59, 59))
        callback();
      }
    };
    const validateApplyStare = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择报名开始时间"));
      } else {
        if (this.form.registrationEnd !== "") {
          this.$refs.activityForm.validateField('registrationEnd');
        }
        callback();
      }
    };
    const validateApplyEnd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择报名结束时间"));
      } else if (value < this.form.registrationBegin) {
        callback(new Error("结束时间需晚于开始时间!"));
      } else if (this.form.endTime < value) {
        callback(new Error("报名结束时间不能晚于活动结束时间!"));
      } else {
        this.form.registrationEnd = new Date(new Date(this.form.registrationEnd).setHours(23, 59, 59, 59))
        callback();
      }
    };
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
    return {
      list:[],
      form:{
        title:'',
        introduction:'',
        beginTime:'',
        endTime:'',
        registrationBegin:'',
        registrationEnd:'',
        location:'',
        registerMax:'',
        contact:'',
        contactPhone:'',
        cover:''
      },
      startDatePicker: '',
      endDatePicker: this.processDate(),
      rules:{
        title: [{required:true,message:'活动名不能为空',trigger: 'blur'}],
        introduction: [{required:true,message:'活动详情不能为空',trigger: 'blur'}],
        beginTime: [{
          validator: validateEventStare,
          trigger: "change"
        }],
        endTime: [{
          validator: validateEventEnd,
          trigger: "change"
        }],
        registrationBegin: [{
          validator: validateApplyStare,
          trigger: "change"
        }],
        registrationEnd: [{
          validator: validateApplyEnd,
          trigger: "change"
        }],
        location: [{required: true,message: '活动地点不能为空',trigger: 'blur'}],
        registerMax: [
          { required: true, message: '人数上限不能为空', trigger: 'blur' },
          {
            type: 'number',
            message: '人数上限大于0小于100，且不为小数',
            trigger: 'blur',
            transform(value) {
              if(value !== null && value !== '') {       //value  Input框内容
                if (String(value).trim() === '' || Number(value) < 0 || Number(value) >100
                    || (String(value).indexOf(".") + 1) > 0) {
                  return false
                }else{
                  return Number(value)
                }
              }else {
                return null
              }
            }
          }
        ],
        cover: [{required:true,message:'活动封面不能为空',trigger: 'blur'}],
        contact: [{required: true,message: '联系人不能为空',trigger: 'blur'}],
        contactPhone: [{ required: true, validator:checkPhone, trigger: 'blur' },],
      },
      previewImgURL:'',
      headerObj:{
        token:this.$store.getters.adminInfo?this.$store.getters.adminInfo.token:null
      },
      flag: false,
    }
  },
  methods:{
    editorChange(data){
      this.form.introduction = data
    },
    disabledDate(time) {
      return time.getTime() < new Date(date).getTime()
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          // 如果开始时间不为空，则结束时间大于开始时间
          if (self.item.startYear) {
            return new Date(self.item.startYear).getTime() > time.getTime();
          } else {
            // 开始时间不选时，结束时间最大值小于等于当天日期
            return time.getTime() > Date.now();
          }
        }
      };
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
    handleChangeFile(file, fileList){
      console.log(file)
      this.form.cover = file.raw
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.previewImgURL = reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    },
    saveForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          // 文件上传
          let formData = new FormData()
          formData.append("file",this.form.cover)
          let res = await uploadFile(formData);
          this.form.cover = res.data.data
          // 保存
          createActivity(this.form).then(resp => {
            if (resp.data.code === 200){
              this.$message({
                type: "success",
                message:resp.data.msg
              })
              this.$refs['activityForm'].resetFields()
              this.$store.dispatch('tagsView/delVisitedView', this.$route);
              this.$router.push("/admin/activity")
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
        // alert('确定')
        this.$refs['activityForm'].resetFields()
        this.$store.dispatch('tagsView/delVisitedView', this.$route);
        this.$router.push('/admin/activity')
      }).catch(() => {
        this.$message({
          type: "info",
          message: "成功取消"
        })
      })
    },
    //确定位置
    mapConfirm(val) {
      // console.log('经纬度',val)
      this.flag = false
      this.form.location = val.address
    },
    //点击取消
    mapCancel() {
      this.flag = false;
    },
    // 打开定位
    getLocation() {
      this.flag = true;
      console.log(this.flag)
    }
  }
}
</script>

<style scoped>
.create-activity{
  /*height: calc(100vh - 169px);*/
  /*overflow: auto;*/
  /*position: relative;*/
}
.create-activity-title{
  text-align: center;
  /*background-color: #FAFAFA;*/

  position: relative;
  top: 0;
  left: 0;
  /*width: 100%;*/
  min-height: 39px;
  line-height: 39px;
  padding: 5px 15px;
  border-width: 0 0 1px;
  border-bottom: 1px solid #d8dce5;
  font-size: 14px;
}
.create-activity-form{
  margin-top: 15px;
  margin-right: 150px;

  overflow: auto;
}
</style>
