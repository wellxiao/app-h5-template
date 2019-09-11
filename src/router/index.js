import Vue from 'vue'
import Router from 'vue-router'
import {
  HelloWorld,
  Weather,
  Rules
} from './fullpath'
import config from '@/config'

Vue.use(Router)



//routerBase 为地址前缀
const router = new Router({
  base: config.routerBase,
  mode: 'history',
  routes: [{
    path: '/HelloWorld',
    name: 'HelloWorld',
    meta: {
      title: 'HelloWorld'
    },
    component: HelloWorld
  }, {
    path: '/Weather',
    name: 'Weather',
    meta: {
      title: '天气预报'
    },
    component: Weather
  }, {
    path: '/Rules',
    name: '规则',
    meta: {
      title: '测试规则'
    },
    component: Rules
  }]
})


export default router
