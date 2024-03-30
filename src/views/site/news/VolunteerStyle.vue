<template>
  <div class="zykx">
    <div class="main bannerimg">
      <div class="mid" >
        <div style="padding-top: 105px">
          <el-row :gutter="20">
            <el-col :span="12" v-for="item in menuList" :key="item.id">
              <div class="wrapper">
                <div style="min-height: 320px">
                  <h2 class="subtitle">
                    {{item && item.title}}
                    <router-link target="_blank" :to="{name:item.name,params:{id:item.id}}">更多</router-link>
                  </h2>
                  <div class="list list-small">
                    <div class="list-row row w" v-for="obj in item.newsList" :key="obj.id">
                      <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                      <span class="col v-m t-r">{{obj.createTime | changeTime('{y}-{m}-{d}')}}</span>
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
import pagination from '@/components/Pagination';
import {columnsById} from "@/api/site/columns";

export default {
  name: "index",
  components:{
    pagination
  },
  computed:{

  },
  created() {
    this.getList()
  },
  data(){
    return {
      listQuery:{
        page:1,
        limit:6,
        newsType:'',
      },
      menuList:[],
      total:0,
    }
  },
  methods:{
    getList(){
      this.listQuery.newsType = this.$route.params.menuId
      columnsById(this.listQuery).then(resp => {
        this.menuList = resp.data.data.menuList
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
