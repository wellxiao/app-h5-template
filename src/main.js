// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { logger, environment } from '@/util/methods'
import App from './App'

import FastClick from 'fastclick'

// 安卓jsbridge需要加载附件
const { isApp, isAndroid } = environment()
if (isAndroid) {
  require('@/util/WebViewJavascriptBridge')
}
require('@/util/jsBridge')

/* eslint-disable */
import router from './router'
import store from './store'

// 如果需要install vue-touch，那么使用 cnpm install vue-touch@next
import VueTouch from 'vue-touch'
import VConsole from 'vconsole/dist/vconsole.min.js'
if (process.env.NODE_ENV !== 'production') {
    let vConsole = new VConsole() // 初始化
}
// 移动设备上的浏览器默认会在用户点击屏幕大约延迟300毫秒后才会触发点击事件
// ，这是为了检查用户是否在做双击。为了能够立即响应用户的点击事件
FastClick.attach(document.body)
Vue.use(VueTouch, { name: 'v-touch' })
// 动态加载标题
Vue.use(require('vue-wechat-title'))

Vue.config.productionTip = false
Vue.prototype.$logger = logger

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
