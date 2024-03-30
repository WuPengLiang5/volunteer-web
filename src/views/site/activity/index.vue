<template>
  <div class="app-container">
    <div class="main">
      <div class="mid">
        <section style="margin-top: 25px">
          <div class="filter-container">
            <el-select v-model="listQuery.state" placeholder="状态" clearable class="filter-item" style="width: 130px" @change="handleFilter">
              <el-option v-for="item in activityStates" :key="item.key" :label="item.label" :value="item.key" />
            </el-select>
            <el-input v-model="listQuery.title" placeholder="搜索活动..." style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-input v-model="listQuery.location" placeholder="活动区域" style="width: 200px" class="filter-item" @keyup.enter.native="handleFilter" />
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
          </div>
          <div class="app-container-content">
            <el-row style="margin: 0 -16px">
              <el-col :span="6" class="activity-item-box" v-for="item in list" :key="item.id">
                <router-link :to="{path:'/site/activityDetail',query:{id:item.id}}">
                  <el-card :body-style="{padding:'0px'}" style="width: 260px" shadow="hover">
                    <img :src="item.cover" class="activity-item-img" />
                    <p class="t-c">
                      <el-button :type="showStatusType(item.state)" size="small" round>
                        {{item.state | getActivityState}}
                      </el-button></p>
                    <h3 class="activity-item-box-h3"><a :title="item.title">{{item.title}}</a></h3>
                    <div class="activity-item-day">
                      <span style="width: 68px;margin-left: 15px">报名截止：</span>
                      <p class="activity-item-day-p">
                        <el-progress :percentage="changePercentage(item.registrationBegin,item.registrationEnd)" :show-text="false" :stroke-width="8"></el-progress>
                      </p>
                      <span style="width: 50px;margin-left: 10px">{{remainderDay(item.registrationBegin,item.registrationEnd)}}</span>
                    </div>
                    <p class="activity-item-other">
                    <span style="text-align: left">
                      目标：<span>{{item.registerMax}}</span>个
                    </span>
                      <span class="fr clearfix">
                      报名：<span>{{item.recruitNumber}}</span>个
                    </span>
                    </p>
                  </el-card>
                </router-link>
              </el-col>
            </el-row>
          </div>
          <div class="app-container-bottom">
            <pagination v-show="total>0"
                        :total="total"
                        :page.sync="listQuery.page"
                        :limit.sync="listQuery.limit"
                        :layout="'total, prev, pager, next, jumper'"
                        @pagination="getList" />
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchActivityList} from "@/api/site/activity";
import pagination from '@/components/Pagination'

export default {
  name: "index",
  components:{
    pagination
  },
  created() {
    this.getList()
  },
  data(){
    return {
      list:[],
      total:0,
      listQuery:{
        title:'',
        location:'',
        state:'',

        page:1,
        limit:12
      },
      activityStates:[{key:'',label:'全部'},{key:'10',label:'招募待启动'},{key:'11',label:'招募中'},{key:'12',label:'招募已结束'},{key:'2',label:'已结束'}]
    }
  },
  methods:{
    getList(){
      fetchActivityList(this.listQuery).then(resp => {
        if (resp.data.code === 200){
          this.list = resp.data.data
          this.total = resp.data.total
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    showStatusType(val) {
      switch (val) {
        case 10: return 'info'
        case 11: return 'success'
        case 12: return 'warning'
        case 2: return 'danger'
      }
    },
    changePercentage(start, end){
      let staytimeGap = new Date(end).getTime() - new Date(start).getTime();
      let currentStaytimeGap = new Date().getTime() - new Date(start).getTime();
      let stayDay = Math.floor(staytimeGap / (24 * 3600 * 1000));  // 总天数
      let currentStayDay = Math.floor(currentStaytimeGap / (24 * 3600 * 1000)); // 用了多少天

      // console.log(staytimeGap,currentStaytimeGap,staytimeGap - currentStaytimeGap)
      let result
      if(currentStaytimeGap <= 0){
        result = 0
      }else if((staytimeGap - currentStaytimeGap) <= 0){
        result = 100
      }else {
        result = Math.floor((currentStaytimeGap / staytimeGap) * 100)
      }

      // console.log(result)
      return result
    },
    remainderDay(start, end){
      let staytimeGap = new Date(end).getTime() - new Date(start).getTime();
      let currentStaytimeGap = new Date().getTime() - new Date(start).getTime();

      let stayDay = Math.floor(staytimeGap / (24 * 3600 * 1000));  // 总天数
      let currentStayDay = Math.floor(currentStaytimeGap / (24 * 3600 * 1000)); // 用了多少天

      // console.log(((staytimeGap -currentStaytimeGap) / (24 * 3600 * 1000)))
      let result = Math.floor(((staytimeGap -currentStaytimeGap) / (24 * 3600 * 1000)))

      if (result <= 0){
        return '已结束'
      }
      return result + '天'
    }
  }
}
</script>

<style scoped>
.main{
  min-height: 530px;
}
.mid{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.filter-container{
  margin: 10px 0;
}
.activity-item-box{
  padding: 15px;
}
.t-c{
  margin-top: -20px;
  margin-bottom: 20px;
  height: 24px;
}
.activity-item-img{
  width: 260px;
  height: 170px;
}
.activity-item-box-h3{
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*display: -webkit-box;*/
  /*-webkit-line-clamp: 1;*/
  /*-webkit-box-orient: vertical;*/
}
.activity-item-box-h3 a{
  display: block;
  font-size: 16px;
  color: #333;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  cursor: pointer;
}
.activity-item-day{
  display: flex;
  align-items: center;
  flex-direction: row;
  font-size: 12px;
  margin: 6px 0;
}
.activity-item-day span{
  font-weight: normal;
  font-size: 12px;
  color: #808080;
}
.activity-item-day-p{
  width: 146px;
  display: inline-block;
  /*margin-left: 10px;*/
  /*margin-right: 10px;*/
}
.activity-item-day-p >>> .el-progress__text{
  font-size: 12px!important;
}
.activity-item-other{
  margin: 14px;
  font-weight: normal;
  font-size: 12px;
  color: #808080;
}
.activity-item-other span:first-child{
  /*margin-left: 10px;*/
}
.activity-item-other span:nth-last-child(1){
  margin-right: 10px;
}
.app-container-bottom{
  width: 50%;
  margin: 0 auto;
}
</style>
