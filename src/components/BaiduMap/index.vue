<template>
  <el-dialog slot="—" :title="title" :width="width" :visible.sync="showMapComponent" top="5vh" custom-class="baidu-map" @close="cancel">
    <div class="map-container">
      <div style="margin-bottom: 20px">
        经度:<el-input v-model="center.lng" style="width: 200px"></el-input>
        纬度:<el-input v-model="center.lat" style="width: 200px"> </el-input>
<!--        <Poptip trigger="focus">-->
          地址:
          <el-input v-model="center.address" style="width: 200px" />
          <div slot="content">{{ formatNumber }}</div>
<!--        </Poptip>-->
      </div>
<!--      4sdsAhEpDw7MM3afGKNQibyhuF7Y4ngO-->
<!--      6EZdorkf6kz2p7GPPHdhlDZ7xTuclD0c-->
      <baidu-map
        class="map"
        ak="4sdsAhEpDw7MM3afGKNQibyhuF7Y4ngO"
        :center="{ lng: center.lng, lat: center.lat }"
        :zoom="17"
        :scroll-wheel-zoom="true"
        @ready="handler"
        @click="getClickInfo"
        @moving="syncCenterAndZoom"
        @moveend="syncCenterAndZoom"
        @zoomend="syncCenterAndZoom">
        <bm-view style="width: 100%; height: 500px"></bm-view>
        <bm-marker
          :position="{ lng: center.lng, lat: center.lat }"
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE">
<!--          <bm-info-window :show="isShowInfo"-->
<!--                          :position="{ lng: center.lng, lat: center.lat }"-->
<!--                          :title="'当前位置：'"-->
<!--                          @close="infoWindowClose"-->
<!--                          @open="infoWindowOpen">-->
<!--            <p><span>{{address}}</span></p>-->
<!--          </bm-info-window>-->
        </bm-marker>
        <bm-control :offset="{ width: '10px', height: '10px' }">
          <bm-auto-complete v-model="keyword" :sugStyle="{ zIndex: 999999 }">
            <el-input v-model="keyword" type="text" placeholder="请输入地名关键字" clearable>
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </bm-auto-complete>
        </bm-control>
        <!--缩放控件-->
        <bm-navigation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" ></bm-navigation>
        <!-- 地图类型 -->
        <bm-map-type :map-types="mapType"  anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <bm-local-search
          :keyword="keyword"
          :auto-viewport="true"
          style="width: 0; height: 0; overflow: hidden">
        </bm-local-search>
      </baidu-map>
    </div>
    <span slot="footer">
      <el-button icon="el-icon-close" @click="cancel">取 消</el-button>
      <el-button icon="el-icon-place" type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {BaiduMap, BmView, BmLocalSearch, BmNavigation, BmMarker, BmInfoWindow, BmControl, BmAutoComplete, BmMapType } from 'vue-baidu-map'

export default {
  name: "Map",
  components:{
    BaiduMap,
    BmView,
    BmLocalSearch,
    BmNavigation,
    BmMarker,
    BmInfoWindow,
    BmControl,
    BmAutoComplete,
    BmMapType
  },
  props: {
    dialogVisible: Boolean,
    mapHeight: {
      type: Number,
      default: 500,
    },
    title: {
      type: String,
      default: '选择目标位置'
    },
    width: {
      type: [Number, String],
      default: '85%'
    },
    height: {
      type: [Number, String],
      default: '80%'
    },
    address: {
      type: String,
      default: ''
    }
  },
  watch: {
    dialogVisible: function (currentValue) {
      this.showMapComponent = currentValue;
      if (currentValue) {
        this.keyword = "";
      }
    },
    address: function (currentValue) {
      this.address = currentValue;
    },
  },
  created() {
    // console.log('value',this.dialogVisible,this.showMapComponent)
  },
  data(){
    return {
      BMap:null,
      map:'',
      showMapComponent: this.dialogVisible,
      keyword: "",
      loading: false,
      isShowInfo: false,
      mapStyle: {
        width: "100%",
        height: this.mapHeight + "px",
      },
      center: { lng: "", lat: "", address: "",},
      zoom: 15,
      mapType:['BMAP_NORMAL_MAP','BMAP_SATELLITE_MAP'],
    }
  },
  computed: {
    formatNumber() {
      if (this.center.address === "") return "";
      function parseNumber(str) {
        const re = /(?=(?!)(d{3})+$)/g;
        return str.replace(re, ",");
      }
      return parseNumber(this.center.address);
    },
  },
  methods:{
    //自动定位
    handler({ BMap, map }) {
      this.BMap = BMap;
      this.map = map
      this.scanMap()
    },
    scanMap() {
      console.log(this.address)
      if (this.address){
        const geoCoder = new BMap.Geocoder();
        // 获取位置对应的坐标
        geoCoder.getPoint(this.address, (point) => {
          this.center.lng = point.lng
          this.center.lat = point.lat;
        });
        this.center.address = this.address
      }else{
        const that = this;
        // 获取自动定位方法
        const geolocation = new this.BMap.Geolocation();
        const gc = new this.BMap.Geocoder();
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        //获取自动定位获取的坐标信息
        geolocation.getCurrentPosition(function (r) {
            console.log('返回详细地址和经纬度', r.address)
            that.center.lng = r.longitude;
            that.center.lat = r.latitude;
            const point = new that.BMap.Point(r.point.lng, r.point.lat); // 根据经纬度创建点坐标

            gc.getLocation(point,function (res){
              that.center.address = res.address
            })
          },
          { enableHighAccuracy: true }
        );

        // if (this.center.lng === "" || this.center.lat === "") {
          // // 默认地址
          // this.center = {
          //   lng: 113.027698,
          //   lat: 28.144912,
          // };
          // var point = new this.BMap.Point(113.027698, 28.144912); // 根据经纬度创建点坐标
          // console.log("经纬度空的");
        // } else {

      }
    },
    // 地图点击事件。
    getClickInfo(e) {
      // console.log(e)
      const gc = new BMap.Geocoder();
      let _this = this;
      gc.getLocation(e.point, function (res) {
        console.log(res,res.address); //地址信息
        _this.center.address = res.address;
        const addrComponent = res.addressComponents
        const surroundingPois = res.surroundingPois
        const province = addrComponent.province
        const city = addrComponent.city
        const district = addrComponent.district
        let addr = addrComponent.street
        if (surroundingPois.length > 0 && surroundingPois[0].title) {
          if (addr) {
            addr += `-${surroundingPois[0].title}`
          } else {
            addr += `${surroundingPois[0].title}`
          }
        } else {
          addr += addrComponent.streetNumber
        }

        console.log(province, city, district, addr)
      });
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
    syncCenterAndZoom(e) {
      setTimeout(() => {
        this.show = false;
      }, 10000);
      this.loading = !this.center.lng;
      this.zoom = e.target.getZoom();
    },
    infoWindowClose() {
      //弹框关闭
      this.isShowInfo = false;
    },

    infoWindowOpen() {
      //弹框打开
      this.isShowInfo = true;
    },

    //确认
    confirm: function () {
      this.showMapComponent = false;
      // 将map-confirm事件传出，给父组件
      this.$emit("map-confirm", this.center);
    },
    //取消
    cancel: function () {
      this.showMapComponent = false;
      // 将map-cancel事件传出，给父组件
      this.$emit("map-cancel", this.showMapComponent);
    },
  }
}
</script>

<style scoped>
/*.map-container__wrapper{*/
/*  width: calc(100% - 10px);*/
/*  position: fixed;*/
/*  top: 0;*/
/*  right: 0;*/
/*  !*bottom: 0;*!*/
/*  left: 0;*/
/*  overflow: auto;*/
/*  margin: 0;*/
/*}*/
/*.map-container{*/
  /*width: 700px;*/
  /*height: 550px;*/
  /*margin-top: 15vh;*/
  /*margin-left: 50%;*/
  /*transform: translateX(-50%);*/
  /*position: relative;*/
  /*border-radius: 2px;*/
  /*box-shadow: 0 1px 3px rgba(0,0,0,0.3);*/
  /*box-sizing: border-box;*/
/*}*/
</style>
