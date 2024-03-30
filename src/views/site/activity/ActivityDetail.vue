<template>
  <div class="app-container">
    <div class="main">
      <div class="mid">
        <div class="app-container-content">
          <el-row v-cloak>
            <el-col :span="8" class="activitydetail-left">
              <div class="activity-item-box">
                <img :src="this.activity.cover" class="activity-item-img"  alt=""/>
                <h3 class="activity-item-box-h3">{{activity.title}}</h3>
                <div class="activity-item-day">
                  <span>报名截止：</span>
                  <p class="activity-item-day-p">
                    <el-progress :percentage="changePercentage(activity.registrationBegin,activity.registrationEnd)" :show-text="false" :stroke-width="8"></el-progress>
                  </p>
                  <span>{{remainderDay(activity.registrationBegin,activity.registrationEnd)}}</span>
                </div>
                <p class="activity-item-plist">
                  活动地点：<span>{{activity.location}}</span>
                </p>
                <p class="activity-item-plist">
                  活动日期：
                  <span>{{activity.beginTime | changeTime('{y}-{m}-{d}')}}</span>
                  至
                  <span>{{activity.endTime | changeTime('{y}-{m}-{d}')}}</span>
                </p>
                <p class="activity-item-plist">
                  招募日期：
                  <span>{{activity.registrationBegin | changeTime('{y}-{m}-{d}')}}</span>
                  至
                  <span>{{activity.registrationEnd | changeTime('{y}-{m}-{d}')}}</span>
                </p>
                <p class="activity-item-plist">
                  联系人：<span>{{activity.contact}}</span>
                </p>
                <p class="activity-item-plist">
                  联系方式：<span>{{activity.contactPhone}}</span>
                </p>
                <div class="activity-item-registration">
                  计划招募：<span style="color: #e60012">{{activity.registerMax}}</span>
                  已招募：<span style="color: #e60012">{{activity.recruitNumber}}</span>
                  <el-button v-if="!isSign && (new Date() - new Date(activity.registrationEnd) <= 0)" style="float: right;margin: 3px 16px 0 0" size="mini" type="danger" @click="signup">我要报名</el-button>
                </div>
              </div>

            </el-col>
            <el-col :span="15" :offset="1"  class="activitydetail-right">
              <div class="detail-title">
                <h3>活动详情</h3>
              </div>
              <div class="detail-content">
                <div class="ql-container ql-snow" style="border: 0">
                  <div class="ql-editor" v-html="activity.introduction"></div>
                </div>
              </div>
              <div class="detail-title">
                <h3>报名信息</h3>
              </div>
              <div class="detail-registration">
                <el-table
                  ref="multipleTable"
                  :data="registrationInfo"
                  tooltip-effect="dark">
                  <el-table-column
                    v-if="false"
                    prop="id"
                    label="编号"/>
                  <el-table-column
                    prop="name"
                    min-width="120"
                    align="center"
                    label="姓名"/>
                  <el-table-column
                    prop="duration"
                    min-width="150"
                    align="center"
                    label="服务时长">
                    <template slot-scope="scope">
                      {{scope.row.duration + '小时'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="报名时间"
                    min-width="150"
                    align="center">
                    <template slot-scope="scope">
                      {{scope.row.registrationTime | changeTime('{y}-{m}-{d}')}}
                    </template>
                  </el-table-column>
                </el-table>
                <div class="table-pagination">
                  <pagination v-show="total>0" :layout="layout" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchActivity} from "@/api/site/activity";
import {createSignUp} from "@/api/admin/signUp";
import {fetchSignUpByActivityId, fetchSignUpByAIdAndUId} from "@/api/site/signUp"

import pagination from "@/components/Pagination"

const defaultActivity = {
  id: '',
  title: '',
  introduction: '',
  cover: '',
  location: '',
  beginTime: undefined,
  endTime: undefined,
  registrationBegin: undefined,
  registrationEnd: undefined,
  registerMax: '',
  recruitNumber:'',
  contact: '',
  contactPhone: '',
  state: '',
}
export default {
  name: "ActivityDetail",
  components:{
    pagination
  },
  computed:{
    userId(){
      return this.$store.getters.userInfo?this.$store.getters.userInfo.id:null
    }
  },
  data(){
    return {
      activity:Object.assign({},defaultActivity),
    // {
    //   name:'1陈栋',
    //     duration:'0.00小时',
    //   registrationTime:'2022-03-10'
    // },
    // {
    //   name:'邓柏林',
    //     duration:'0.00小时',
    //     registrationTime:'2022-03-10'
    // }
      registrationInfo:[],
      layout:'total, prev, pager, next, jumper',
      listQuery:{
        page:1,
        limit:5,
        activityId:''
      },
      isSign: false,
      total:20
    }
  },
  created() {
    this.getData()
  },
  methods:{
    async getData(){
      let id = this.$route.query.id
      // console.log(id)
      await fetchActivity({id:id}).then(resp => {
        if (resp.data.code === 200){
          this.activity = resp.data.data
          // console.log(this.activity)
        }
      })
      await this.getSignUpByAIdAndUId()
      await this.getList()
    },
    getSignUpByAIdAndUId(){
      if (!this.userId){
        return
      }

      let id = this.$route.query.id
      fetchSignUpByAIdAndUId({userId: this.userId,activityId: id}).then(resp => {
        if (resp.data.code === 200){
          this.isSign = !!resp.data.data
        }
      })
    },
    getList(){
      this.listQuery.activityId = this.activity.id
      fetchSignUpByActivityId(this.listQuery).then(resp => {
        if (resp.data.code === 200){
          // console.log(resp.data.data)
          this.registrationInfo = resp.data.data
          this.total = resp.data.total
        }
      })
    },
    changePercentage(start, end){
      // console.log(start,end)
      if (!start || !end){
        return 0
      }
      let staytimeGap = new Date(end).getTime() - new Date(start).getTime();
      let currentStaytimeGap = new Date().getTime() - new Date(start).getTime();

      let result
      if(currentStaytimeGap <= 0){
        result = 0
      }else if ((staytimeGap - currentStaytimeGap) <= 0){
        result = 100
      }else {
        result = Math.floor((currentStaytimeGap / staytimeGap) * 100)
      }

      return result
    },
    remainderDay(start, end){
      let staytimeGap = new Date(end).getTime() - new Date(start).getTime();
      let currentStaytimeGap = new Date().getTime() - new Date(start).getTime();

      let result = Math.floor(((staytimeGap -currentStaytimeGap) / (24 * 3600 * 1000)))

      if (result <= 0){
        return '已结束'
      }
      return result + '天'
    },
    signup(){
      if (!this.userId){
        this.$message.error("请先登录！")
        return
      }

      let signup = {
        userId:this.userId,
        activityId:this.activity.id
      }
      createSignUp(signup).then(resp => {
        if (resp.data.code === 200 && resp.data.data){
          this.getSignUpByAIdAndUId()
          this.$message.success("成功报名，请等待审核")
        }
      })
    }
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.main{
  min-height: 530px;
}
.mid{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.app-container-content{
  width: 1190px;
  min-height: 700px;
  padding: 40px 0;
}
.activity-item-box{
  width: 388px;
  padding-bottom: 10px;
  border: 1px solid #dcdddd;
  border-radius: 5px
}
.activity-item-img{
  width: 100%;
  height: 265px;
  background-position: center;
}
.activity-item-box-h3{
  display: inline-block;
  width: 368px;
  height: 41px;
  margin: 0 10px;
  line-height: 41px;
  font-weight: 400;
  font-size: 18px;
  overflow: hidden;
}
.activity-item-day{
  width: 368px;
  line-height: 25px;
  font-size: 14px;
  margin: 6px 10px;
}
.activity-item-day span{
  font-weight: normal;
  font-size: 18px;
  color: #808080;
}
.activity-item-day-p{
  width: 210px;
  display: inline-block;
}
.activity-item-day-p >>> .el-progress__text{
  font-size: 18px!important;
}
.activity-item-plist{
  padding: 10px 0 0 10px;
  font-size: 18px;
  color: #999;
}
.activity-item-registration{
  height: 38px;
  padding: 10px 0 0 10px;
  font-size: 18px;
  color: #999;
  line-height: 38px;
  margin: 0 auto;
}
.activitydetail-right{
  padding: 15px 0;
}
.detail-title{
  padding: 25px 0;
  /*background: #fff0f1;*/
  border-bottom: 1px solid #dcdddd;
}
.detail-title h3{
  font-size: 18px;
  font-weight: bold;
  color: #999;
}
.detail-content{
  min-height: 200px;
}
.table-pagination{
  margin: 0 auto;
  width: 560px;
}
</style>
