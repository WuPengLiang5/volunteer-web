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
                    <router-link target="_blank" :to="{name:item.name,params:{id:item.id,type:item.type}}">更多</router-link>
                  </h2>
                  <div class="list list-small">
                    <div class="list-row row w" v-for="obj in item.newsList" :key="obj.id">
                      <router-link :to="'/site/newsInfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>
                      <span class="col v-m t-r">{{obj.createTime | formatDate}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
<!--        <div style="padding-top: 105px" v-if="this.userInfo.type === 2">-->
<!--          通知公告-->
<!--        </div>-->

<!--        <div style="padding-top: 105px" v-if="this.userInfo.type === 1">-->
<!--          <el-row :gutter="20">-->
<!--            <el-col :offset="6" :span="12">-->
<!--              <div class="wrapper">-->
<!--                <div style="min-height: 320px">-->
<!--                  <h2 class="subtitle">-->
<!--                    志愿活动-->
<!--                  </h2>-->
<!--                  <div class="list list-small">-->
<!--                    <div class="list-row row w" v-for="obj in newsList" :key="obj.id">-->
<!--                      <router-link :to="'/site/newsinfo/' + obj.id" class="col v-m oneline">{{obj && obj.title}}</router-link>-->
<!--                      <span class="col v-m t-r">{{obj.createTime | formatDate}}</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import {fetchNewsByType} from "@/api/news";
import {menus} from "@/views/site/layout";
import pagination from '@/components/Pagination';

export default {
  name: "index",
  components:{
    pagination
  },
  computed:{
    childMenu(){
      let id = this.$route.params.id
      return this.menus.filter((item) => {
        return item.pid === id;
      })
    }
  },
  beforeRouteUpdate (to, from, next) {
    console.log('from',from)
    next()
    console.log('to',to)
    // console.log('路由更新之后：从to获取参数', to,'从this.$route获取参数', this.$route.params.type)
    this.getMenu()
    this.getList()
  },
  created() {
    this.getMenu()
    this.getList()
  },
  data(){
    return {
      menus,
      listQuery:{
        page:1,
        limit:6,
        newsType:'',
      },
      menu: null,
      menuList:[],
      total:0,
    }
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
    async getList(){
      if (this.childMenu.length !== 0){
        let menuList = []
        for (let i in this.childMenu){
          this.listQuery.newsType = this.menu.id + ',' + this.childMenu[i].id
          await fetchNewsByType(this.listQuery).then(resp => {
            menuList.push({
              "title":this.childMenu[i].title,
              "id":this.childMenu[i].id,
              "type":this.childMenu[i].type,
              'name':this.childMenu[i].name,
              "newsList":resp.data.data
            })
          })
        }

        this.menuList = menuList
      }
    },
    navTo(item){
      // console.log('111',item)
      this.$router.push({name:item.name,params:{id:item.id,type:item.type,title:item.title}})
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
