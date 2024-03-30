<template>
  <div class="home">
    <div class="home-top clearfix" v-if="userInfo">
      <img :src="userInfo.avatar" alt="">
      <div class="home-text clearfix al">
        <p class="home-welcome">欢迎回来,{{userInfo.name}}</p>
        <ul style="margin-top: 10px">
          <li>注册日期：<span>{{ userInfo.registerTime | changeTime}}</span></li>
          <li>登录IP：<span>{{ userInfo.loginIp }}</span></li>
        </ul>
        <ul style="margin-top: 10px">
          <li>上次登录时间：<span>{{userInfo.loginTime | changeTime}}</span></li>
        </ul>
      </div>
    </div>
    <div class="home-center">
      <el-row>
        <el-col :span="8">
          <div class="home-center-item">
            <i class="el-icon-time"/>
            <p>
              <span class="value">{{ userInfo.durations?userInfo.durations:'0' }}</span>
              <span class="text">服务时长（小时）</span>
            </p>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="home-center-item">
            <i class="iconfont icon-huodongguanli"/>
            <p>
              <span class="value">{{ userInfo.activityNum }}</span>
              <span class="text">参加志愿活动（个）</span>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {fetchUserInfo} from "@/api/admin/user";

export default {
  name: "MyHome",
  data(){
    return{
      // userInfo:{
      //   id:'',
      //   name:'',
      //   avatar:'',
      //   registerTime:'',
      //   loginIp:'',
      //   loginTime:'',
      //   durations:0,
      //   activityNum:0
      // }
      userInfo:{}
    }
  },
  created() {
    this.fetchData()
  },
  methods:{
    async fetchData(){
      await fetchUserInfo().then(resp => {
        this.userInfo = resp.data.data
        if (!this.userInfo.avatar){
          this.userInfo.avatar = require('@/assets/user/defaultAvatar.svg')
        }
      })
    },
  }
}
</script>

<style scoped>
.home .home-top{
  padding: 15px 0 30px;
  border-bottom: solid 1px #e6e6e6;
}
.home .home-top img{
  width: 93px;
  height: 93px;
  margin-right: 20px;
  float: left;
  border-radius: 50%;
}
.home-top .home-text{
  width: 720px;
  float: left;
}
.home-text ul li{
  display: inline-block;
  *display: inline;
  *zoom: 1;
  letter-spacing: normal;
  word-spacing: normal;
  padding: 0 7px;
  margin-top: 5px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  width: 48%;
  color: #666;
  /*overflow: hidden;*/
  /*white-space: nowrap;*/
  /*text-overflow: ellipsis;*/
}
.home-text ul li:first-child{
  border-left: none;
  padding-left: 0;
}
.home-text ul li{
  margin-top: 0;
}
.home-top .home-text .home-welcome{
  color: #167CF3;
  font-weight: normal;
  font-size: 24px;
}
.home .home-center{
  height: 200px;
  padding: 10px 53px;
}
.home-center-item{
  display: flex;
  justify-items: center;
  align-items: center;
}
.home-center-item i{
  font-size: 45px;
}
.home-center-item .value{
  font-size: 30px;
  font-family: '微软雅黑', serif;
  color: red;
  display: block;
  padding:2px 31px;
  /*text-align: center;*/
}
.home-center-item .text{
  font-size: 14px;
  padding-left: 5px;
}
.home-center-item p span{
  /*display: block;*/
  /*font-size: 20px;*/
}

</style>
