<template>
  <div class="personal">
    <el-tabs class="personal-tabs" v-model="currentView">
      <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"></el-tab-pane>
      <!--:is 的作用：会将div标签转换成 currentView 变量绑定的这个组件-->
      <div :is="currentView" keep-alive></div>
    </el-tabs>
  </div>
</template>

<script>
import UserInfo from "./components/UserInfo";
import UpdatePassword from "./components/UpdatePassword";
import UpdateAvatar from "./components/UpdateAvatar";

export default {
  name: "Personal",
  components:{
    UserInfo,
    UpdatePassword,
    UpdateAvatar
  },
  data(){
    return {
      // navList:[
      //   {'title':'基本信息','path':'/site/user/userLayout/userInfo'},
      //   {'title':'修改密码','path':'/site/user/userLayout/updatePassword'},
      //   {'title':'更换头像','path':'/site/user/userLayout/updateAvatar'},
      // ],
      // navActive:'基本信息',
      tabs:[
        {label:'基本信息',name:'UserInfo'},
        {label:'修改密码',name:'UpdatePassword'},
        {label:'更换头像',name:'UpdateAvatar'}
      ],
      currentView:'UserInfo'
    }
  },
  methods:{
    // selectNav(item){
    //   this.navActive = item
    // }
  },
  created() {
    // this.$router.push('/site/user/userLayout/userInfo')
  }
}
</script>

<style scoped>
.personal{
  /*width: 395px;*/
}
.personal-tabs{
  margin-left: 10px;

  /*font-size: 18px;*/
}
/*.personal-tab{*/
/*  font-size: 18px;*/
/*}*/
/*.personal-nav{*/
/*  background-color: rgb(255,240,241);*/
/*  text-align: left;*/
/*}*/
/*.personal-nav ul{*/
/*  margin-left: 10px ;*/
/*}*/
/*.personal-nav ul li{*/
/*  display: inline-block;*/
/*  font-size: 18px;*/
/*  padding: 0 0;*/
/*  margin: 5px 15px;*/
/*  height: 28px;*/
/*  line-height: 28px;*/
/*  color: #666;*/
/*  cursor: pointer;*/
/*}*/
/*.personal-nav ul li:hover{*/
/*  color: #E60517;*/
/*  border-bottom: 4px solid #E60517;*/
/*}*/
/*.personal-nav ul li.active{*/
/*  color: #E60517;*/
/*  border-bottom: 4px solid #E60517;*/
/*}*/
/*.personal-content{*/
/*  margin: 15px 10px 0 10px;*/
/*}*/
</style>
