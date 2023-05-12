<template>
  <div class="chart" ref="echarts"></div>
</template>

<script>
import echarts from 'echarts'
// require('echarts/theme/macarons') // echarts theme
import 'echarts/lib/chart/map'
import 'echarts/map/js/china.js';
import {fetchVolunteerMap} from "@/api/volunteer";

export default {
  name: "MapChart",
  data(){
    return {
      volunteerMaps:[],
      volunteerTotalNum:0
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
  },
  methods:{
    async fetchData(){
      await fetchVolunteerMap().then(resp => {
        this.volunteerMaps = resp.data.data
        this.volunteerTotalNum = resp.data.total
        // this.volunteerMaps = [{'name':'北京','value':100},{'name':'上海','value':200}]
        // this.volunteerTotalNum = 500
        this.init()
      })
    },
    init(){
      let myChart = echarts.init(this.$refs.echarts);
      let option = {
        //标题，每个图表最多仅有一个标题控件，每个标题控件可设主副标题
        title: {
          //主标题文本，'\n'指定换行
          text: '志愿者分布',
          //副标题文本，'\n'指定换行
          // subtext: '微信用户分布图',
          //水平安放位置，默认为左侧，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          x: 'center',
          //垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          y: 'top'
        },
        tooltip: { // 鼠标移到图里面的浮动提示框
          formatter (params) {
            // params.data 就是series配置项中的data数据遍历
            let volunteerNum
            if(params.data) {
              volunteerNum = params.data.value;
            }else{
              volunteerNum = 0;
            }
            let htmlStr = `
                          <p style='text-align:left'>
                                志愿者数量<br/>
                                ${params.name}：${volunteerNum}<br/>
                          </p>
                        `;
            return htmlStr;
          }
        },
        visualMap: {
          max: this.volunteerTotalNum,
          min: 0,
          text: ['高', '低'],
          itemHeight: '200',
          orient: 'vertical',
          inRange: {
            color: ['#DDDDDD', '#026FDD']
          },
          show:true
        },
        //缩放漫游组件，仅对地图有效  右上角移动组件有问题
        roamController: {
          //显示策略，默认为显示(true),可选为：true（显示） | false（隐藏）。
          show: false,
          //水平安放位置，默认为左侧('letf')，可选为：'center' | 'left' | 'right' | {number}（x坐标，单位px）
          x: 'right',
          //垂直安放位置，默认为全图顶端，可选为：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
          y: 'top',
          //必须，默认无(null),指定漫游组件可控地图类型，如：{ china: true }
          mapTypeControl: {
            //指定地图类型
            'china': true
          }
        },
        series: [
          {
            name: '', // 浮动框的标题（上面的formatter自定义了提示框数据，所以这里可不写）
            type: 'map',
            mapType: 'china', // 自定义扩展图表类型
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            },
            // 这是需要配置地图上的某个地区的数据，根据后台的返回的数据进行拼接（下面是我定义的假数据）
            data:this.volunteerMaps
          }
        ]
      };
      myChart.setOption(option);
      window.addEventListener('resize', function () {
        myChart.resize();
      });
    }
  }
}
</script>

<style scoped>
.chart{
  width: 100%;
  height: 100%;
}
</style>
