<template>
  <div class="app-container">
    <div class="app-container-content">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8" style="padding: 0 16px">
          <div class="chart-wrapper">
            <DataChart title="性别统计" :data-list="sexList"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <DataChart title="政治面貌" :data-list="politic"/>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <DataChart title="从业情况" :data-list="occupation"/>
          </div>
        </el-col>
      </el-row>
      <el-row style="background-color: #fff">
        <el-col :span="24">
          <div class="js-map-data">
            <DataChartMap></DataChartMap>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import DataChart from "./components/DataChart";
import DataChartMap from '@/views/site/home/components/DataChart'
import {fetchVolunteerPie} from "@/api/admin/volunteer";

export default {
  name: "index",
  components: {DataChart,DataChartMap},
  data(){
    return {
      sexList:[],
      politic:[],
      occupation:[]
    }
  },
  created() {
    this.getVolunteerPie()
  },
  mounted() {
  },
  methods:{
    getVolunteerPie(){
      fetchVolunteerPie().then(resp => {
        this.sexList = resp.data.data.sexList
        this.politic = resp.data.data.politic
        this.occupation = resp.data.data.occupation
      })
    }
  }
}
</script>

<style scoped>
.app-container{
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
  height: 100vh;
}
.app-container-content{
  margin-top: 10px;
  /*border: 1px solid #d8dce5;*/
}
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
.js-map-data{
  width: 800px;
  height: 500px;
  margin: 0 auto;
  padding: 10px 0;
}
</style>
