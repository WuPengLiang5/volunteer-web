<template>
  <div class="zykx">
    <div class="main bannerimg">
      <div class="mid" >
        <div style="padding-top: 105px">
          <el-row :gutter="20">
            <el-col :offset="6" :span="12">
              <div class="wrapper">
                <div style="min-height: 320px">
                  <h2 class="subtitle">
                    {{menu.title}}
                  </h2>
                  <div class="list list-small">
                    <div class="list-row row w" v-for="obj in newsList" :key="obj.id">
                      <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                      <span class="col v-m t-r">{{obj.createTime | formatDate}}</span>
                    </div>
                  </div>
                </div>
                <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchNewsByType} from "@/api/news";
import pagination from "@/components/Pagination"
import {menus} from "@/views/site/layout";

export default {
  name: "VolunteerNews",
  components:{
    pagination
  },
  data(){
    return {
      newsList:[],
      listQuery:{
        page:1,
        limit:10,
        newsType:'',
      },
      menus,
      menu:null,
      total:0,
    }
  },
  created() {
    this.listQuery.newsType = this.$route.params.id
    this.getMenu()
    this.getList()
  },
  methods:{
    getMenu(){
      let id = this.$route.params.id
      if(id){
        this.menu = this.menus.filter((item)=>{
          return item.id === id;
        })[0]
      }else{
        this.menu = {};
      }
    },
    getList(){
      fetchNewsByType(this.listQuery).then(resp => {
        this.newsList = resp.data.data
        this.total = resp.data.total
      })
    },
  }
}
</script>

<style scoped>
.main{
  background: url(~@/assets/user/main-bg.1e1ab6c.png) no-repeat top center;
  min-height: 530px;
}
.mid{
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
}
.wrapper{
  border: 1px solid #f2c9bb;
  background: rgba(255, 255, 255, 0.6);
  padding: 15px;
  margin-bottom: 20px;
}
.wrapper .subtitle {
  padding-left: 16px;
  border-bottom: 0;
  line-height: normal;
  margin: 10px 0;
}
.wrapper .subtitle:before {
  left: 0;
}
.subtitle:before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 20px;
  background: #cc0000;
  position: absolute;
  left: 20px;
  top: 50%;
  margin-top: -10px;
}
.wrapper .subtitle a {
  right: 0;
}
.subtitle a {
  position: absolute;
  right: 30px;
  top: 50%;
  display: inline-block;
  width: 70px;
  line-height: 24px;
  border-radius: 14px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  background: #cc0000;
  border: 1px solid #cc0000;
  font-weight: normal;
  transition: 0.3s;
  margin-top: -12px;
  cursor: pointer;
}
.subtitle {
  font-size: 20px;
  color: #333;
  font-weight: bold;
  line-height: 60px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  padding-left: 36px;
  margin: 0;
}
.list {
  padding: 10px 0;
}
.list-small .list-row {
  padding-top: 11px;
  padding-bottom: 15px;
  min-height: 44px;
}
.list .list-row {
  padding: 13px 0 13px 12px;
  line-height: 1;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
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
.w {
  width: 100%;
}
.row {
  display: table;
  table-layout: fixed;
  box-sizing: border-box;
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
</style>
