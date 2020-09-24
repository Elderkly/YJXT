// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './main.scss'
import './ant.scss'
import 'video.js/dist/video-js.css'
import './assets/style/video-js.min.css'
import VueAMap from 'vue-amap'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false

Vue.use(VueAMap)
Vue.use(Antd)

VueAMap.initAMapApiLoader({
  key: '72a33bd05c5a2def4bea81c2397a34a8',
  // plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType'],
  v: '1.4.4',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
