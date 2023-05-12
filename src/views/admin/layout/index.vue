<template>
  <div :class="classObj" class="app-wrapper">
    <div class="layuimini-loader" :style="disappear">
      <div class="layuimini-loader-inner"></div>
    </div>
    <el-container style="width: 100%;height: 100%;">
      <!-- 侧边栏-->
      <el-aside class="sidebar-container" :width="asideWidth">
        <Sidebar ref="sidebar"/>
      </el-aside>
      <el-container>
        <el-header class="header" height="85px" :style="currentBackground.header">
          <Navbar @openDraw="openDraw" />
          <tags-view />
        </el-header>
        <el-main class="main">
          <div class="main-content">
            <router-view />
          </div>
        </el-main>
        <el-footer height="21px">
          <div class="main-foot"></div>
        </el-footer>
      </el-container>
    </el-container>
    <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false"
        size="20%"
        class="color-drawer">
      <div class="color-title">
        <span>配色方案</span>
      </div>
      <div class="color-content">
        <el-radio-group @change="handleBackground"
                        v-for="(item,index) in radios" :key="index"
                        v-model="currentBackground.label">
          <el-radio :label="item.label">
            <div class="bg-content" >
              <div class="skin-color bg-skin-purple" :style="item.header"></div>
              <p>{{item.label}}</p>
            </div>
          </el-radio>
        </el-radio-group>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import TagsView from './components/TagsView/index'
import Sidebar from "./components/Sidebar";
import {backgroundColors} from '@/settings'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: "Main",
  components:{
    Navbar,
    TagsView,
    Sidebar
  },
  mixins: [ResizeMixin],
  computed:{
    ...mapState({
      // needTagsView: state => state.settings.tagsView,
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    },
    currentBackground(){
      return this.$store.getters.currentBackground
    },
  },
  created() {
    this.disappearLoader()
  },
  beforeCreate() {

  },
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPassword.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return{
      disappear:'',
      isCollapse: false,
      // elMenuStyle:'height:calc(100vh - 61px);',
      asideWidth:'210px',
      radios:backgroundColors,
      drawer:false,
      formPassword:{
        password:'',
        newPassword:''
      },
      rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur'}
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
      },
    }
  },
  methods:{
    // 初始加载
    disappearLoader(){
      setTimeout(()=>{
        this.disappear='display:none'
      },1500)
    },
    // handleNav(){
    //   this.isCollapse = this.isCollapse === false;
    //   this.asideWidth = !this.isCollapse?'210px':'54px';
    //   this.elMenuStyle= !this.isCollapse?'height:calc(100vh - 61px);':'height:100vh;'
    // },
    handleSelect(key,keyPath){
      // console.log("111",key)
      this.$router.push(key)
    },
    // 注意对象引用
    // 更新背景颜色
    handleBackground(value){
      this.$store.commit("settings/CHANGE_BACKGROUND_COLOR",value)
    },
    openDraw(){
      this.drawer=true;
    },
  },
  watch:{
    $route(route){

    },
  }
}
</script>

<style scoped>
.app-wrapper{
  width: 100%;
  height: 100%;
  position: relative;
}
/**初始化加载层*/
.layuimini-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 999999;
}
.layuimini-loader .layuimini-loader-inner {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #1E9FFF;
  animation: spin 2s linear infinite;
}
.layuimini-loader .layuimini-loader-inner:before {
  content: "";
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #1E9FFF;
  animation: spin 3s linear infinite;
}
.layuimini-loader .layuimini-loader-inner:after {
  content: "";
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #1E9FFF;
  animation: spin 1.5s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(1turn);
  }
}

/*侧边栏*/
/*.aside{*/
/*  !*height: 100vh;*!*/
/*  overflow-x: hidden;*/
/*  overflow-y: hidden;*/
/*}*/

.aside .menu-admin{
  /*height:calc(100vh - 61px);*/
}
.aside .menu-admin .el-submenu .el-menu-item,
.aside .menu-admin .nest-menu .el-submenu>.el-submenu__title {
  /*min-width: 210px!important;*/
  background-color: #1f2d3d!important;
}
.aside .menu-admin .el-submenu .el-menu-item:hover,
.aside .menu-admin .nest-menu .el-submenu>.el-submenu__title:hover {
  background-color: #001528!important;
}
/*头部样式*/
.header{
  position: relative;
  /*background-color: #e82121;*/
  padding: 0;
}


/*中间部分*/
.main{
  padding: 15px !important;
  background-color: rgb(242,242,242);
}
.main .main-title{
  height: 40px;
  line-height: 40px;
  padding-left: 35px;
  padding-right: 35px;
  font-size: 14px;
  position: relative;
  border: 1px solid whitesmoke;
  background-color: white;
}
.main .main-title .main-title-text{
  position: absolute;
  left: 35px;
  top: 50%;
  transform: translateY(-50%);
}
.main .main-title ul{
  position: relative;
  margin-left: 6%;
  line-height: 40px;
  transition: all .2s;
  -webkit-transition: all .2s;
}
.main .main-title ul li{
  font-size: 14px;
  transition: all .2s;
  -webkit-transition: all .2s;
  float: left;
  padding: 0 3px;
  text-align: center;
  cursor: pointer;
}
.main .main-title ul li span:nth-child(2){
  margin-left: 10px;
}
.main .main-content{
  /*margin: 15px 3px 15px 15px;*/
  border: 1px solid #f2f2f2;
  border-radius: 5px;
  background-color: #ffffff;
  height: calc(100vh - 164px);
  overflow: auto;
}
.main-foot{
  width: inherit;
  height: 21px;
  /*position: absolute;*/
  /*bottom: 0;*/
  background-color: #ffffff;
}
/*配色方案*/
.color-drawer{
  margin-top: 60px;
  right: 0;
}
.color-drawer .color-title{
  padding: 10px 0 10px 20px;
  border-bottom: 1px solid #d9dada;
  margin-bottom: 8px;
  text-align: left;
  font-size: 14px;
}
.color-drawer .color-content{
  padding: 10px 5px 0 5px;
}
.color-drawer .color-content .bg-content{
  width: 225px;
  height: 60px;
  line-height: 60px;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 5px 5px;
  cursor: pointer;
  background-color: #f5f5f5;
}
.color-drawer .color-content .bg-content p{
  font-size: 16px;
  float: left;
  margin-left: 20px;
}
.skin-color{
  width: 36px;
  height: 36px;
  float: left;
  border-radius: 4px;
  margin: 10px 0;
}

/*.sidebar-container{*/
/*  height: 100%;*/
/*  background-color: #304156;*/
/*}*/
</style>
<style>
.color-content .el-radio-group .el-radio .el-radio__inner{
  position: relative;
  right: -175px;
  top: 45px;
}
.el-cascader-node>.el-radio, .el-radio:last-child{
  margin-right: 25px;
}
.el-submenu .el-menu-item{
  padding: 0 20px;
}
/*隐藏文字*/
.el-menu--collapse  .el-submenu__title span{
  display: none;
}
/*隐藏 > */
.el-menu--collapse  .el-submenu__title .el-submenu__icon-arrow{
  display: none;
}
.el-menu--vertical{
  left: 55px!important;
}
</style>
