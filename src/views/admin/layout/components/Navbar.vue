<template>
  <div class="navbar">
    <div class="hamburger-container" @click="toggleSideBar">
      <a class="el-icon-s-fold" v-if="isCollapse" title="折叠侧边栏" />
      <a class="el-icon-s-unfold" v-else title="展开侧边栏" />
    </div>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <div @click="screen"><i :class="isScreen"></i></div>
      <div class="info">
        <el-dropdown @command="handleCommand">
          <span>欢迎您！{{username}}</span>
          <el-dropdown-menu slot="dropdown" class="dropdown" >
            <el-dropdown-item command="info"><i class="el-icon-info"></i>查看个人信息</el-dropdown-item>
            <el-dropdown-item command="updatePassword"><i class="el-icon-s-tools"></i>修改密码</el-dropdown-item>
            <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <span @click="openDraw">
          <i class="iconfont icon-sangediandian"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb/index'
import {mapGetters} from "vuex";

export default {
  components: {
    Breadcrumb,
  },
  props:{

  },
  data(){
    return{
      isScreen:'iconfont icon-quanping',
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse(){
      return !this.sidebar.opened
    },
    username(){
      return this.$store.getters.adminInfo ? this.$store.getters.adminInfo.username : ''
    }
  },
  methods: {
    toggleSideBar(){
      this.$store.dispatch('app/toggleSideBar')
    },
    // 网页全屏
    screen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
      this.isScreen=!this.fullscreen?"iconfont icon-quanping":"iconfont icon-tuichuquanping";
    },
    handleCommand(command){
      switch (command) {
        case 'info':
          this.$router.push({path:'/admin/profile/userInfo'})
          break;
        case 'updatePassword':
          this.$router.push('/admin/profile/updatePassword')
          break;
        case 'logout':
          this.logout()
          break;
        default: break;
      }
    },
    openDraw(){
      this.$emit("openDraw")
    },
    logout(){
      this.$message.success("退出成功")
      this.$store.dispatch("user/logout","admin")
      this.$router.push('/admin/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  color: white;

  .hamburger-container {
    padding: 0 15px;
    line-height: 70px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
    a{
      color: rgba(255, 255, 255, 0.7);
      font-size: 1.8rem;
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    width: 20%;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    margin-right: 30px;

    &:focus {
      outline: none;
    }
    div{
      cursor: pointer;
      color: rgba(255,255,255,.7);
    }
  }
}
</style>
