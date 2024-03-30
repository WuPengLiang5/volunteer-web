<template>
  <el-container>
    <el-header :height="'88px'">
      <div class="header-logo-container" style="overflow:hidden">
        <img class="header-logo" src="@/assets/user/logo.png" alt="">
<!--        <div class="header-logo-left" style="float: left">-->
<!--          <img class="header-logo" src="@/assets/user/logo2.png" alt="">-->
<!--        </div>-->
<!--        <h1 class="header-logo-right" style="float: left;">-->
<!--          <p style="margin-left:10px;font-size: 25px">志愿服务网</p>-->
<!--          <img style="width: 138px;height: 38px;" src="@/assets/user/logo3.png" alt="">-->
<!--        </h1>-->
      </div>
      <div class="header-login" v-if="!userInfo">
        <span>
          <router-link to="/site/login">登录</router-link>
        </span>
        |
        <span>
          <router-link to="/site/register">注册</router-link>
        </span>
      </div>
      <div class="header-user-name" v-else>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="center">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <div class="menu-container">
        <el-menu
          v-if="menus"
          class="website-header-menu"
          mode="horizontal"
          background-color="#e60012"
          text-color="#fff"
          active-text-color="#bc0202"
          router
          :default-active="$route.name">
          <el-menu-item v-for="item in menus"
                        :index="item.name"
                        :route="{name:item.name,params:{menuId:item.id}}"
                        :key="item.id">
            {{item.title}}
          </el-menu-item>
        </el-menu>
      </div>
      <router-view/>
    </el-main>
    <el-footer style="margin-top: 20px">
      <div class="footer">
        <div class="mid-layout">
          <div class="mid-layout-left">
            <div class="link-list">
              <span>友情链接:</span>
              <a href="http://www.zgzyz.org.cn/" title="中国青年志愿网">中国青年志愿网</a>
              <span>|</span>
              <a href="http://www.pubchn.com/" title="公益中国网">公益中国网</a>
              <span>|</span>
              <a href="http://www.gqt.org.cn/" title="中国共青团">中国共青团</a>
              <span>|</span>
              <a href="https://www.cvf.org.cn/" title="中国志愿服务联合会">中国志愿服务联合会</a>
            </div>
            <div class="row">
              <p>客服电话：800-8208820<b>客服QQ群：236257231</b></p>
              <p>邮箱：admin@qq.com<b>技术支持：####</b></p>
            </div>
          </div>
        </div>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
// import {menus} from "@/views/site/layout/index";
import {listWebColumns} from "@/api/site/columns";

export default {
  name: "Container",
  data(){
    return {
      menus:[]
    };
  },
  computed:{
    userInfo(){
      // console.log(this.$store.getters.userInfo)
      return this.$store.getters.userInfo
    }
  },
  created() {
    // console.log(this.$route.name)

    this.getAllColumns()
    for (let i in this.menus){
      if (this.menus[i].name === this.$route.name){
        this.$store.dispatch('onstage/changeMenuId',this.menus[i].id)
      }
    }
  },
  beforeRouteUpdate(to,from,next){
    // console.log('路由更新之前：从to获取参数', to.params.menuId, '从this.$route获取参数', this.$route.params.menuId)
    next()
    // console.log('路由更新之后：从to获取参数', to.params.menuId, '从this.$route获取参数', this.$route.params.menuId)
    if (to.params.menuId){
      for (let i in this.menus){
        if (this.menus[i].name === to.name){
          this.$store.dispatch('onstage/changeMenuId',to.params.menuId)
        }
      }

    }
  },
  methods:{
    getAllColumns(){
      listWebColumns().then(resp => {
        this.menus = resp.data.data
      })
    },
    handleCommand(command){
      switch (command){
        case "center":
          this.$router.push("/site/user/userLayout/home")
          break;
        case "logout":
          this.logout()
          break;
      }
    },
    logout(){
      this.$message.success("退出成功")
      this.$store.dispatch("user/logout","user")
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.el-header{
  padding-top:13px;
  width:100%;
  box-shadow: 0 0 5px rgb(221, 220, 220);
  background-color: white;
  position: relative;
  text-align: left;
}
.header-logo-container{
  /*padding: 0 97px;*/
  width: 1200px;
  margin: 0 auto;
}
.header-logo{
  width: 225px;
  height: 66px;
  position: relative;
  left: 0;
  cursor:pointer;
}
/*.website-header-menu{*/
/*  display: inline-block;*/
/*  position: absolute;*/
/*  !*width: 100%;*!*/
/*  padding-left: 10px;*/
/*  !*padding-left: 100px;*!*/
/*  background-color: #ffffff;*/
/*  overflow: hidden;*/
/*}*/
/*.website-header-menu .el-menu-item{*/
/*  height: 66px;*/
/*  line-height: 66px;*/
/*  font-size: 18px;*/
/*  margin: 0 8px;*/
/*  padding: 0 15px;*/
/*  color: #303133*/
/*}*/
.menu-container{
  background-color: #e60012;
}
.menu-container .el-menu--horizontal{
  border-bottom: 0;
}
.website-header-menu{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.website-header-menu .el-menu-item{
  font-size: 20px;
  border-top: 1px solid #e60012;
  border-bottom: 1px solid #e60012;
}
.website-header-menu .el-menu-item.is-active {
  background-color: #fff!important;
  color: #fff;
}
.website-header-menu .el-menu-item:hover {
  background-color: #fff!important;
  border-bottom: 1px solid #e60012!important;
  color: #bc0202!important;
}
.header-login{
  padding-top: 13px;
  position: absolute;
  top:50%;
  right: 112px;
  transform: translateY(-50%);
}
.header-login span{
  font-size: 20px;
  margin: 0;
  padding: 0 3px;
  vertical-align: top;
  height: 76px;
  cursor: pointer;
}
.header-user-name{
  padding-top: 13px;
  position: absolute;
  top:50%;
  right: 80px;
  transform: translateY(-50%);

  cursor: pointer;
}
.header-user-name span{
  color: #c7000b;
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.el-main{
  padding: 0;
}
.el-footer {
  min-height: 220px;
  background-color: #1b293a;
  font-size: 18px;
  /*margin-top: 45px;*/
}
.footer{
  padding: 50px 0;
}
.footer p{
  font-size: 14px;
  color: #ccc;
  margin: 5px 0;
}
.mid-layout{
  /*width: 1200px;*/
  /*margin-left: 100px;*/
}
.mid-layout-left{
  vertical-align: top;
  width: 800px;
  margin: 0 auto;
}
.mid-layout .mid-layout-left .link-list{
  font-size: 14px;
  color: #fff;
  margin-bottom: 20px;
  border-bottom: 1px dashed #fff;
  padding-bottom: 20px;
  margin-right: 50px;
  display: flex;
  flex-direction: row;
}
.mid-layout .mid-layout-left .link-list span{
  display: block;
  margin:0 10px;
}
.mid-layout .mid-layout-left .link-list span:first-child{
  display: block;
  margin-left: 0;
}
.mid-layout .mid-layout-left .link-list a{
  cursor: pointer;
  color: #fff;
}
.mid-layout .mid-layout-left .row{
  display: flex;
  flex-direction: column;
}
.row b{
  margin-left: 30px;
}
</style>
<style>

</style>
