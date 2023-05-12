// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store";

import axios from "./utils/axios";

//引入初始化的样式css icon字体
import './style/index.scss'
import './assets/custom-theme/iconfont/iconfont.css'

/*引入ElementUI*/
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// vue-quill-editor富文本编辑器的使用
import  VueQuillEditor from 'vue-quill-editor'
import Quill from 'quill'

// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入图片缩放插件,需要依赖Quill模块
import ImageResize from 'quill-image-resize-module'
//引入图片拖拽插件,需要依赖Quill模块
import {ImageDrop} from "quill-image-drop-module"
//注册插件
Quill.register('modules/imageResize',ImageResize)
Quill.register('modules/imageDrop',ImageDrop)
Vue.use(VueQuillEditor)

import './permission'
import './directive/index'
import * as filters from './filters' // global filters

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//一次性解决时区和日期格式问题
import moment from 'moment'
Date.prototype.toISOString = function () {
  return moment(this).format("YYYY-MM-DD HH:mm:ss");
};

Vue.config.productionTip = false
Vue.prototype.$axios=axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
