<template>
  <div style="width: 100%;height: calc(100% - 50px);">
    <div class="header-logo" v-if="!isCollapse" :style="currentBackground.aside">
      <a>
        <img src="@/assets/admin/logo.png" alt="">
        <span>
                志愿服务管理系统
              </span>
      </a>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :style="elMenuStyle+'background-color:#304156'"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="'#304156'"
        :text-color="'#bfcbd9'"
        :unique-opened="false"
        :active-text-color="'#409EFF'"
        :collapse-transition="false"
        mode="vertical"
      >
        <SidebarItem v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from "./SidebarItem";

export default {
  components: {
    SidebarItem
  },
  props:{
    elMenuStyle:{
      type: String,
      default: 'height: calc(100vh - 56px);'
    }
  },
  computed:{
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    currentBackground(){
      return this.$store.getters.currentBackground
    },
  },
  created() {
    // console.log(this.permission_routes)
  },
  data(){
    return {

    }
  },
  methods:{

  }
}
</script>

<style scoped>
.header-logo{
  height: 50px;
  line-height: 50px;

  cursor: pointer;

  border-bottom-color: hsla(0,0%,100%,.2019);
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
.header-logo img{
  display: inline-block;
  height: 35px;
  vertical-align: middle;
}
.header-logo span{
  font-size: 16px;
  color: #fff;
  line-height: 18px;
}
</style>
