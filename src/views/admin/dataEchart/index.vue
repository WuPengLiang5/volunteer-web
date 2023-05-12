<template>
  <div class="app-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <DataChart title="性别统计" :data-list="sexList"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <DataChart title="从业情况" :data-list="occupation"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataChart from "./components/DataChart";

export default {
  name: "index",
  components: {DataChart},
  data(){
    return {
      sexList:[{value:100, name:'男'},
        {value:310, name:'女'},],
      occupation:[{value:100, name:'学生'},
        {value:310, name:'工人'},
        {value: 100, name: '公务员'}]
    }
  },
  mounted() {
  },
  methods:{

  }
}
</script>

<style scoped>
.app-container{
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;
}
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
</style>
