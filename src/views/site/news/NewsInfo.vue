<template>
  <div class="zykx">
    <div class="main bannerimg">
      <div class="mid" >
        <div class="mid-content">
          <el-row :gutter="20">
            <el-col :offset="3" :span="18">
              <div class="detail wrapper">
                <div style="min-height: 300px">
                  <h2 style="text-align: center">{{news.title}}</h2>
                  <div class="detail-tips">
                    <span>日期：<span>{{news.createTime | changeTime('{y}-{m}-{d}')}}</span></span>
                    <span>来源：<span>{{news.source}}</span></span>
                  </div>
                  <div class="detail-content">
                    <div class="ql-container ql-snow" style="border: 0">
                      <div class="ql-editor" v-html="news.content"></div>
                    </div>
                  </div>
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
import {fetchNews} from "@/api/site/news";

export default {
  name: "NewsInfo",
  created() {
    this.newsId = this.$route.params.id
    console.log(this.newsId)
    this.getNews()
  },
  data(){
    return {
      newsId:'',
      news: {
        title:'',
        createTime:undefined,
        source:'',
        content:''
      }
    }
  },
  methods:{
    async getNews(){
      await fetchNews({"id":this.newsId}).then(resp => {
        if (resp.data.code === 200){
          this.news = resp.data.data
        }

        // console.log(resp.data.data)
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
  background: url(~@/assets/user/main-bg.1e1ab6c.png) no-repeat top center;
  min-height: 530px;
}
.mid{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.mid-content{
  padding-top: 105px;
  min-height: 500px;
}
.wrapper{
  border: 1px solid #f2c9bb;
  background: rgba(255, 255, 255, 0.6);
  padding: 15px;
  margin-bottom: 20px;
}
.detail h2{
  display: block;
  font-size: 24px;
  margin-block-start: 0.83em;
  margin-block-end: 0.83em;
  margin-inline-start: 0;
  margin-inline-end: 0;
  font-family:'微软雅黑',serif;
  font-weight: 700
}
.detail-tips{
  text-align: center;
  padding: 25px 0;
}
.detail-tips span{
  font-size: 14px;
  color: #333;
  margin: 0 10px;
}
</style>
