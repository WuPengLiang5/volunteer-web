<template>
  <div class="edit-component">
      <el-upload
          class="upload-annex"
          :show-upload-list="false"
          :on-change="handleChange"
          :on-error="handleError"
          :format="['jpg','jpeg','png','gif']"
          :max-size="2048"
          :auto-upload="false"
          multiple
          action="#"
      >
        <el-button size="small" type="primary"></el-button>
      </el-upload>
      <quill-editor
          v-model="content"
          ref="myQuillEditor"
          :options="editorOption"
          @blur="onEditorBlur($event)"
          @focus="onEditorFocus($event)"
          @change="onEditorChange($event)"
          class="editor">
      </quill-editor>
    </div>
</template>

<script>

import editorOption from './option'
import { addQuillTitle } from './quill-title'

export default {
  name: "MyQuillEditor",
  props:{
    //接收父组件的参数
    quillContent:{
      type:String,
      default:''
    },
  },
  watch: {
    quillContent(val = '') {
      //监听父组件参数变化,回显到富文本框
      this.content = val;
    },
  },
  data(){
    return {
      content: this.quillContent || '',
      editorOption: editorOption,
      uploadError: false
    }
  },
  mounted() {
    addQuillTitle()
    // console.log(this.quillContent)
  },
  methods:{
    onEditorBlur(){//失去焦点事件
    },
    onEditorFocus(){//获得焦点事件
    },
    onEditorChange({quill,html,text}){//内容改变事件
      // console.log("editor change", quill,text,html);
      this.content = html; // 保存输入的内容
      this.$emit("editorChange", html);
    },
    handleChange(file,fileList){
      console.log("handleChange")
      if (this.uploadError){
        return ;
      }

      if (!file || !window.FileReader){
        return ;
      }
      let reader = new FileReader()
      reader.readAsDataURL(file.raw)

      let _this=this
      reader.onloadend = function (e){
        let res=e.target.result


        let img = new Image();
        img.src = res;

        img.onload = function () {
          let width = img.naturalWidth;    // 获取Base64图片的原始图片大小
          let height = img.naturalHeight;
          console.log(img,width,height)
          let quality = 0.8; //图像质量 取值0-1 值越小，所绘制出的图像越模糊
          let canvas = document.createElement("canvas");
          let ctx = canvas.getContext("2d");    // 创建属性节点
          var anw = document.createAttribute("width");
          anw.nodeValue = 200;
          var anh = document.createAttribute("height");
          anh.nodeValue = 200;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 返回base64
          res = canvas.toDataURL("image/png", quality);
        }

        // console.log(res)
        // 获取富文本组件实例
        let quill = _this.$refs.myQuillEditor.quill
        // 如果上传成功
        if (res) {
          // 获取光标所在位置
          let length = quill.getSelection().index;
          // 插入图片，res为服务器返回的图片链接地址
          quill.insertEmbed(length, 'image', res)
          // 调整光标到最后
          quill.setSelection(length + 1)
        } else {
          // 提示信息，需引入Message
          this.$message.error('图片插入失败')
        }
      }
    },
    handleError(){
      this.uploadError=true
      console.log("handleError")
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    }
  }
}
</script>
<style>
.edit-component{
  /*min-height: 200px;*/
}
.editor .ql-toolbar.ql-snow{
  text-align: left;
  line-height: 25px;
}
.edit-component .quill-editor{
  /*width: 500px;*/
  height: 280px !important;
  display: inline-block;
}
.edit-component .ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.edit-component .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0;
  content: "保存";
  padding-right: 0;
}
.edit-component .ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-label::before,
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: "14px";
}
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  content: "18px";
}
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.edit-component .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  content: "32px";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: "文本";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  content: "标题1";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  content: "标题2";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  content: "标题4";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  content: "标题5";
}
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.edit-component .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  content: "标题6";
}
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-label::before,
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: "标准字体";
}
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  content: "衬线字体";
}
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.edit-component .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  content: "等宽字体";
}

.upload-annex{
  display: none;
}
</style>
<style scoped>

</style>
