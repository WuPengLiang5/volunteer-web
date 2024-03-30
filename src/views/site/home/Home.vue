<template>
  <div class="homebody">
    <div class="js-bg-img">
      <div class="mid">
        <div class="index-banner-box">
          <el-carousel height="550px"
                       :interval="4000"
                       @change="changeImg"
                       style="width: 100%;margin-top: 1px;"
                       trigger="click">
            <el-carousel-item v-for="item in banners" :key="item.url">
              <el-image
                :class="className"
                style="width: 100%; height: 100%"
                :src="item.url"
                fit="cover"></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <el-row style="margin-top: 50px" class="js-m-t-50">
          <el-col :span="11" class="news-wrapper">
            <h2 class="title">
              {{newsInformation.title}}
              <router-link target="_blank" :to="{name:newsInformation.name,params:{menuId:newsInformation.id}}">更多</router-link>
            </h2>
            <div class="list list-small">
              <div class="list-row row w" v-for="obj in newsInformation.newsList" :key="obj.id">
                <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                <span class="col v-m t-r">{{obj.createTime | changeTime('{y}-{m}-{d}')}}</span>
              </div>
            </div>
          </el-col>
          <el-col :span="11" :offset="2" class="news-wrapper">
            <h2 class="title">
              <p style="display: inline-block; margin-left: -10px;">{{announcement.title}}</p>
              <router-link target="_blank" :to="{name:announcement.name,params:{id:announcement.id}}">更多</router-link>
            </h2>
            <div class="list list-small">
              <div class="list-row row w" v-for="obj in announcement.newsList" :key="obj.id">
                <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                <span class="col v-m t-r">{{obj.createTime | changeTime('{y}-{m}-{d}')}}</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="js-map-data">
          <DataChart></DataChart>
        </div>
        <div class="elegant-demeanor-box js-m-t-50">
          <h2 class="title">
           志愿风采
          </h2>
          <div class="demeanor-tab">
            <span v-for="item in menuList"
                  :class="[{active:columnSort === item.sort}]"
                  @click="selectedTypeOption(item.sort)">
              {{item.title}}
            </span>
          </div>
          <div class="news-list" v-for="item1 in menuList" v-show="item1.sort === columnSort">
            <el-row :gutter="8" class="elegant-demeanor">
                <el-col :span="6" v-for="(item,index) in item1.newsList" :key="item.id">
                  <el-image v-if="(index%2) === 0" :src="item.cover?item.cover:require('@/assets/user/imgmtbd.png')"/>
                  <div class="js-report-box fr">
                    <router-link :to="{path:'/site/newsInfo/' + item.id}" class="js-title">{{item.title}}</router-link>
                    <p>{{item.content | setText}}</p>
                    <p class="row">
                      <span class="col">
                        <el-image :src="require('@/assets/user/create-time.png')"/>
                        <b>{{item.createTime | changeTime('{y}-{m}-{d}')}}</b>
                      </span>
                      <span class="col">
                        <el-image :src="require('@/assets/user/source.png')" style="margin-left: 5px;"/>
                        <b>{{item.source}}</b>
                      </span>
                    </p>
                  </div>
                  <el-image v-if="(index%2) !== 0" :src="item.cover?item.cover:require('@/assets/user/imgmtbd.png')"/>
                </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DataChart from "@/views/site/home/components/DataChart";
import {getIndexesNewsList} from "@/api/site/columns";

export default {
  name: "Home",
  components:{
    DataChart
  },
  created() {
    this.getList()
  },
  data(){
    return {
      list:[],
      menuList:[],
      newsInformation:'',
      announcement:'',
      listQuery:{
        page:1,
        limit:4,
        newsType:''
      },
      columnSort:'',
      banners: [
        { url: require("@/assets/banner/banner1.png") },
        { url: require("@/assets/banner/banner2.png") },
        { url: require("@/assets/banner/banner3.png") },
        { url: require("@/assets/banner/banner4.jpeg") },
        { url: require("@/assets/banner/banner5.jpeg") },
      ],
      className: ""//轮播图名字
    }
  },
  computed:{
    userInfo(){
      return this.$store.getters.userInfo
    }
  },
  mounted() {
    this.className = "lun-img";
    setTimeout(() => {
      this.className = "lun-img-two";
    }, 300);
  },
  methods:{
    async getList(){
      await getIndexesNewsList().then(resp => {
        this.list = resp.data.data
        this.menuList = this.list[2].menuList
        this.selectedTypeOption('8')
        this.announcement = this.list[0]
        this.newsInformation = this.list[1]
        // console.log(this.list)
      })
    },
    selectedTypeOption(sort){
      this.columnSort = sort
    },
    //轮播图切换
    changeImg(e) {
      // console.log(e, "当前下标");
      this.className = "lun-img";
      setTimeout(() => {
        this.className = "lun-img-two";
      }, 300);
    },
  }
}
</script>

<style lang="scss" scoped>
.js-bg-img{
  overflow: hidden;
  //background: url('~@/assets/user/js-bg-img.fa554ee.png') no-repeat top center;

  .js-map-data{
    width: 800px;
    height: 500px;
    margin: 0 auto;
  }
  .mid{
    width: 1200px;
    margin-left: auto;
    margin-right: auto;

    .index-banner-box {
      width: 100%;
      height: 550px;
      overflow: hidden;
      .lun-img {
        transform: scale(1.5);
      }
      .lun-img-two {
        transition: all 3s;
        transform: scale(1);
      }
      .el-carousel__item.is-animating {
        transition: all 0.6s;
      }
    }

    .news-wrapper{
      .title a{
        position: absolute;
        right: 0;
        top: 50%;
        display: inline-block;
        width: 38px;
        line-height: 16px;
        border-radius: 14px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        background: #cc0000;
        border: 1px solid #cc0000;
        font-weight: normal;
        transition: 0.3s;
        margin-top: -12px;
        cursor: pointer;
      }
      .list{
        padding: 10px 0;
      }
      .list .list-row {
        padding: 13px 0 13px 12px;
        line-height: 1;
        position: relative;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
      }
      .list-small .list-row {
         padding-top: 11px;
         padding-bottom: 15px;
         min-height: 44px;
       }
      .list .list-row:before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        background: #cc0000;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -2px;
        border-radius: 50%;
      }
      .list .list-row a {
        font-size: 16px;
        color: #333;
        width: 80%;
        transition: 0.3s;
        padding-left: 10px;
      }
      .oneline {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .list .list-row span {
        font-size: 16px;
        color: #999;
        width: 20%;
      }
    }

    .elegant-demeanor-box{
      position: relative;
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
    .row .col .el-image{
      width: 14px;
      height: 14px;
      vertical-align: middle;
      border: 0;
    }

    .js-m-t-50{
      margin-top: 50px;
      margin-bottom: 20px;
    }
  }
}
</style>
