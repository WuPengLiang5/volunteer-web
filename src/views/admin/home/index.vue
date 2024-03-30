<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <div class="box">
          <el-card class="box-card">
            <div slot="header" class="card-header clearfix">
              <i></i>
              数据统计
            </div>
            <div>
              <el-row>
                <el-col :span="12" class="card-body">
                  <div class="panel panel-bg">
                    <div class="panel-body">
                      <div class="panel-title">
                        <span class="label fr bg-blue">实时</span>
                        管理员统计
                      </div>
                      <div class="panel-content">
                        <h1>{{adminCount}}</h1>
                        <small>当前分类总记录数</small>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="card-body">
                  <div class="panel panel-bg">
                    <div class="panel-body">
                      <div class="panel-title">
                        <span class="label fr bg-cyan">实时</span>
                        志愿者统计
                      </div>
                      <div class="panel-content">
                        <h1>{{volunteerCount}}</h1>
                        <small>当前分类总记录数</small>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" class="card-body">
                  <div class="panel panel-bg">
                    <div class="panel-body">
                      <div class="panel-title">
                        <span class="label fr bg-orange">实时</span>
                        活动统计
                      </div>
                      <div class="panel-content">
                        <h1>{{activityCount}}</h1>
                        <small>当前分类总记录数</small>
                      </div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12" class="card-body">
                  <div class="panel panel-bg">
                    <div class="panel-body">
                      <div class="panel-title">
                        <span class="label fr bg-green">实时</span>
                        新闻统计
                      </div>
                      <div class="panel-content">
                        <h1>{{newsCount}}</h1>
                        <small>当前分类总记录数</small>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="box">
          <el-card class="box-card">
            <div slot="header" class="card-header clearfix">
              <i></i>
              快捷入口
            </div>
            <div>
              <el-row>
                <el-col :span="6">
                  <div class="quick-module">
                    <router-link to="/admin/news">
                      <i class="iconfont icon-xinwenguanlixitong-xinwenguanli"></i>
                      <cite>新闻管理</cite>
                    </router-link>
                  </div>
                </el-col>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/activity">
                    <i class="iconfont icon-huodongguanli"></i>
                    <cite>活动管理</cite>
                  </router-link>
                </div></el-col>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/user">
                    <i class="iconfont icon-zhiyuanzheguanli"></i>
                    <cite>用户管理</cite>
                  </router-link>
                </div></el-col>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/volunteer">
                    <i class="iconfont icon-zhiyuanzheguanli"></i>
                    <cite>志愿者管理</cite>
                  </router-link>
                </div></el-col>
              </el-row>
              <el-row>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/dataEchart">
                    <i class="iconfont icon-xinwenguanlixitong-xinwenguanli"></i>
                    <cite>数据统计</cite>
                  </router-link>
                </div></el-col>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/signup">
                    <i class="iconfont icon-baomingxinxiguanli"></i>
                    <cite>报名信息管理</cite>
                  </router-link>
                </div></el-col>
                <el-col :span="6"><div class="quick-module">
                  <router-link to="/admin/permission">
                    <i class="iconfont icon-xitongguanli"></i>
                    <cite>系统管理</cite>
                  </router-link>
                </div></el-col>
<!--                <el-col :span="6"><div class="quick-module">-->
<!--                  <a>-->
<!--                    <i class="iconfont icon-xinwenguanlixitong-xinwenguanli"></i>-->
<!--                    <cite>新闻管理</cite>-->
<!--                  </a>-->
<!--                </div></el-col>-->
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {fetchNewsCount} from "@/api/admin/news"
import {fetchActivityCount} from "@/api/admin/activity"
import {fetchVolunteerCount} from "@/api/admin/volunteer"
import {fetchAdminCount} from "@/api/admin/admin"

export default {
  name: "Home",
  computed:{
    ...mapGetters([
      'permission_routes'
    ]),
  },
  data(){
    return {
      newsCount:'',
      adminCount:'',
      volunteerCount:'',
      activityCount:''
    }
  },
  created() {
    // console.log(this.permission_routes[0].path)
    this.getCount()
  },
  methods:{
    getCount(){
      fetchNewsCount().then(resp => {
        if (resp.data.code === 200){
          this.newsCount = resp.data.data
        }
      })
      fetchActivityCount().then(resp => {
        if (resp.data.code === 200){
          this.activityCount = resp.data.data
        }
      })
      fetchVolunteerCount().then(resp => {
        if (resp.data.code === 200){
          this.volunteerCount = resp.data.data
        }
      })
      fetchAdminCount().then(resp => {
        if (resp.data.code === 200){
          this.adminCount = resp.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  .box{
    padding: 8px;

    .card-header{
      position: relative;
      color: #333;
      border-radius: 2px 2px 0 0;
      font-size: 14px;
    }

    .card-body{
      padding: 5px;
    }

    .panel{
      background-color: #fff;
      border: 1px solid transparent;
      border-radius: 3px;
      -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
      box-shadow: 0 1px 1px rgb(0 0 0 / 5%);

      .panel-body{
        padding: 10px;

        .panel-title{
          margin-top: 0;
          margin-bottom: 0;
          font-size: 12px;
          color: inherit;

          .label{
            display: inline;
            padding: 0.2em 0.6em 0.3em;
            font-size: 14px;
            font-weight: 700;
            line-height: 1;
            color: #fff;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            border-radius: 0.25em;
            margin-top: 0.3em;
          }
        }
        .panel-content h1{
          font: 28px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif;
        }
      }
    }
    .panel-bg{
      background-color: #F8F8F8;
    }

    .quick-module{
      text-align: center;
      margin-top: 10px;
      padding: 5px;

      cursor: pointer;
    }

    .quick-module a i {
      display: inline-block;
      width: 100%;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-radius: 2px;
      font-size: 30px;
      background-color: #F8F8F8;
      color: #333;
      transition: all .3s;
      -webkit-transition: all .3s;
    }

    .quick-module a cite {
      position: relative;
      top: 2px;
      display: block;
      color: #666;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      font-size: 14px;
      font-style: normal;
    }
  }
}
//.el-row {
//  margin-bottom: 20px;
//&:last-child {
//   margin-bottom: 0;
// }
//}
//.el-col {
//  border-radius: 4px;
//}
//.bg-purple-dark {
//  background: #99a9bf;
//}
//.bg-purple {
//  background: #d3dce6;
//}
//.bg-purple-light {
//  background: #e5e9f2;
//}
//.grid-content {
//  border-radius: 4px;
//  min-height: 36px;
//}
//.row-bg {
//  padding: 10px 0;
//  background-color: #f9fafc;
//}
</style>
