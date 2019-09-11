import Vue from 'vue'
import Router from 'vue-router'
import {
  HelloWorld,
  Weather
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
    component: HelloWorld
  },{
    path: '/Weather',
    name: 'Weather',
    component: Weather
  }]
})


export default router
