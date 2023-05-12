<template>
  <div class="user-content">
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            active-text-color="#5EC16B"
            router>
          <el-submenu index="1">
            <template slot="title">
              <span>个人中心</span>
            </template>
            <el-menu-item index="/site/user/userLayout/home">我的首页</el-menu-item>
            <el-menu-item index="/site/user/userLayout/personal">修改资料</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">志愿活动</template>
            <el-menu-item index="/site/user/userLayout/activity">我的活动</el-menu-item>
            <el-menu-item index="/site/user/userLayout/duration">志愿时长</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>
.user-content{
  margin: 30px auto 80px;
  padding-top: 5px;
  width: 1190px;
  /*min-height: 530px;*/
  font-size: 0;
}
.user-content .aside{
  /*background-color:gold;*/
  box-shadow: 0 10px 20px #ddd;
}
.user-content .aside .el-menu-vertical-demo{
  background-color: rgb(255,255,255);
  border-right:0;
  min-height: 500px;
}
.el-menu-item:focus, .el-menu-item:hover {
  outline: 0;
  color: #5EC16B;
}
.user-content .main{
  margin-left: 10px;
  background-color: rgb(253,250,253);
  box-shadow: 0 10px 20px #ddd;
}

</style>
