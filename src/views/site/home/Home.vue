<template>
  <div class="homebody">
    <div v-if="userInfo">首页-{{userInfo.username}}-</div>
    <div class="js-map-data">
      <DataChart></DataChart>
    </div>
    <div class="js-bg-img">
      <div class="mid">
        <div class="elegant-demeanor-box js-m-t-50">
          <h2 class="title">
            <p style="display: inline-block; margin-left: -10px;">志愿风采</p>
          </h2>
          <div class="demeanor-tab">
            <span v-for="item in newsTypes"
                  :class="[{active:listQuery.newsType === item.id}]"
                  @click="selectedTypeOption(item.id)">
              {{item.title}}
            </span>
          </div>
          <div class="news-list">
            <el-row :gutter="8" class="elegant-demeanor">
                <el-col :span="6" v-for="(item,index) in newsList" :key="item.id">
                  <el-image v-if="(index%2) === 0" :src="item.cover?item.cover:require('@/assets/user/imgmtbd.png')" lazy/>
                  <div class="js-report-box fr">
                    <a class="js-title">{{item.title}}</a>
                    <p>{{item.content | setText}}</p>
                    <p class="row">
                      <span class="col">
                        <el-image :src="require('@/assets/user/create-time.png')"/>
                        <b>{{item.createTime | formatDate("yyyy-MM-dd")}}</b>
                      </span>
                      <span class="col">
                        <el-image :src="require('@/assets/user/source.png')" style="margin-left: 5px;"/>
                        <b>{{item.source}}</b>
                      </span>
                    </p>
                  </div>
                  <el-image v-if="(index%2) !== 0" :src="item.cover?item.cover:require('@/assets/user/imgmtbd.png')" lazy />
                </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchNewsByType} from '@/api/news'
import DataChart from "@/views/site/home/components/DataChart";

export default {
  name: "Home",
  components:{
    DataChart
  },
  created() {
    this.selectedTypeOption('C17A23BD925143D595A31203A5C7F6DD')
  },
  data(){
    return {
      newsTypes:[{id:'C17A23BD925143D595A31203A5C7F6DD',title:"志愿者"},{id:'77A3DB00B0ED4DD785D158FFA2301685',title:"志愿活动"},],
      newsList:[],
      listQuery:{
        page:1,
        limit:4,
        newsType:''
      }
    }
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  methods:{
    selectedTypeOption(newsType){
      this.listQuery.newsType = newsType
      fetchNewsByType(this.listQuery).then(resp => {
        if (resp.data.code === 200){
          this.newsList = resp.data.data
        }
      })
    }
  }
}
</script>

<style scoped>
.js-bg-img{
  overflow: hidden;
  background: url('~@/assets/user/js-bg-img.fa554ee.png') no-repeat top center;
}
.js-map-data{
  width: 800px;
  height: 500px;
  margin: 0 auto;
}
.mid{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.elegant-demeanor-box{
  position: relative;
}
.js-m-t-50{
  /*margin-top: 50px;*/
  margin-top: 800px;
}
.title{
  font-size: 28px;
  color: #333;
  font-weight: bold;
  min-height: 50px;
  position: relative;
  margin: 0;
}
.demeanor-tab{
  position: absolute;
  right: 0;
  top: 0;
  font-size: 21px;
  color: #666;
  font-weight: normal;
}
.demeanor-tab span {
  display: inline-block;
  margin-left: 53px;
  position: relative;
  height: 37px;
  cursor: pointer;
}
.demeanor-tab .active {
  font-size: 24px;
  font-weight: bold;
}
.demeanor-tab .active::after {
  content: "";
  width: 61px;
  height: 5px;
  background: #e60012;
  border-radius: 3px;
  position: absolute;
  bottom: 0;
  left: 50%;
  -webkit-transform: translate(-50%);
  transform: translate(-50%);
}
.elegant-demeanor{
  margin: 20px -8px 0;
  font-size: 0;
}
.elegant-demeanor .el-image{
  width: 100%;
  height: 164px;
}
.elegant-demeanor .js-report-box {
  width: 100%;
  background: #fdeaea;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;

  display: inline-block;
  height: 155px;
}
.elegant-demeanor .js-report-box .js-title {
  margin-top: 0;
}
.js-report-box .js-title {
  color: #cc0000;
  font-size: 16px;
  margin: 10px 0 7px;
  display: block;
  font-weight: bold;

  cursor: pointer;
  overflow: hidden;
  text-overflow:ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp:1
}
.js-report-box p {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  line-height: 22px;
  text-indent: 2em;
  min-height: 65px;
}
.js-report-box .row {
  text-indent: 0;
  margin-bottom: 10px;
}
.row .col b{
  font-size: 12px;
  color: #999;
  font-weight: normal;
  display: inline-block;
  line-height: 14px;
}
.row .col{
  display: table-cell;
  box-sizing: border-box;
}
.row .col .el-image{
  width: 14px;
  height: 14px;
  vertical-align: middle;
  border: 0;
}
</style>
