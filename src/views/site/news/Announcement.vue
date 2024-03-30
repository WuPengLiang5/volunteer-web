<template>
<!--  <div>通知公告</div>-->
  <div class="zykx">
    <div class="main bannerimg">
      <div class="mid" >
        <div style="padding-top: 80px">
          <el-row :gutter="20">
            <el-col :offset="6" :span="12">
              <div class="wrapper">
                <div style="min-height: 320px">
                  <h2 class="subtitle">
                    通知公告
                  </h2>
                  <div class="list list-small">
                    <div class="list-row row w" v-for="obj in newsList" :key="obj.id">
                      <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                      <span class="col v-m t-r">{{obj.createTime | changeTime('{y}-{m}-{d}')}}</span>
                    </div>
                  </div>
                </div>
                <pagination v-show="total>0" :total="total"
                            :page.sync="listQuery.page"
                            :limit.sync="listQuery.limit"
                            @pagination="getList"
                            :layout="'total, prev, pager, next, jumper'"/>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index";
import {columnsById, listWebColumns} from "@/api/site/columns";

export default {
  name: "Announcement",
  components:{
    pagination
  },
  computed:{
    menuId(){
      return this.$store.getters.menuId
    }
  },
  data(){
    return {
      newsList:[],
      listQuery:{
        page:1,
        limit:15,
        newsType:'',
      },
      total:0,
    }
  },
  created() {
    this.updateMenuId()
  },
  methods:{
    updateMenuId(){
      let route = this.$route
      if (route.name && route.params.menuId){
        this.$store.dispatch('onstage/changeMenuId',route.params.menuId)
        this.getList()
      }else{
        listWebColumns().then(resp => {
          console.log('1')
          let menus = resp.data.data
          for (let item of menus){
            if (item.name === route.name){
              this.$store.dispatch('onstage/changeMenuId',item.id)
            }
          }
          this.getList()
        })
      }
    },
    getList(){
      console.log('2')
      this.listQuery.newsType = this.menuId
      columnsById(this.listQuery).then(resp => {
        this.newsList = resp.data.data.newsList
        this.total = resp.data.data.total
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
