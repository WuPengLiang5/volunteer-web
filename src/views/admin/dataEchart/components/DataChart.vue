<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  name: "DataChart",
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    title: {
      type: String,
      default: ''
    },
    dataList:{
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  created() {
    console.log(this.dataList)
  },
  watch:{
    dataList:{
      handler(newVal, oldVal){
        this.dataList = newVal
        this.initChart()
      },
      deep:true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title : {
          text: this.title,//主标题
          subtext: '',//副标题
          x:'center',//x轴方向对齐方式
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          orient: 'vertical',
          top:'6%',
          left:'6%',
          data: this.dataList.name
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius : '55%',
            center: ['50%', '50%'],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data:this.dataList,
            animationDuration: animationDuration
          }]
      })
    }
  }
}
</script>

<style scoped>

</style>
