<template>
  <div class="home">
    <div class="home-top clearfix">
      <img src="@/assets/user/defaultAvatar.svg" alt="">
      <div class="home-text clearfix al">
        <p class="home-welcome">欢迎回来,李杨</p>
        <ul>
          <li>学号：<span>11823020223</span></li>
          <li>学校：<span>重庆理工大学</span></li>
          <li>手机：<span>13364032815</span></li>
        </ul>
        <ul>
          <li>邮箱：<span>2523157228@qq.com</span></li>
          <li>上次登录时间：<span>2022-01-09 13:21:51</span></li>
        </ul>
      </div>
    </div>
    <div class="home-center"></div>
  </div>
</template>

<script>
export default {
  name: "MyHome"
}
</script>

<style scoped>
.home .home-top{
  padding: 15px 0 30px;
  border-bottom: solid 1px #e6e6e6;
}
.home .home-top img{
  width: 93px;
  height: 93px;
  margin-right: 20px;
  float: left;
  border-radius: 50%;
}
.home-top .home-text{
  width: 720px;
  float: left;
}
.home-text ul li{
  display: inline-block;
  *display: inline;
  *zoom: 1;
  letter-spacing: normal;
  word-spacing: normal;
  padding: 0 7px;
  margin-top: 5px;
  height: 20px;
  line-height: 20px;
  font-size: 14px;
  width: 30%;
  color: #666;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.home-text ul li:first-child{
  border-left: none;
  padding-left: 0;
}
.home-text ul li{
  margin-top: 0;
}
.home-top .home-text .home-welcome{
  color: #167CF3;
  font-weight: normal;
  font-size: 24px;
}
.home .home-center{

}
</style>
