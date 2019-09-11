/*
 * @Author: wellxiao
 * @Date: 2019-09-10
 * @Description: app状态
 */
import {
  demoURL,
  weatherURL
} from "@/api/app";
import {
  request
} from "@/util/http";
import Vue from 'vue'
import axios from 'axios'

const {
  $toast
} = Vue.prototype

export default {
  // 设置true 不是全局的
  namespaced: true,
  state: {
    loading: false,
    demolist: []
  },
  getters: {
    loading({
      loading
    }) {
      return loading;
    }
  },
  actions: {
    /**
     * 示例demo
     * @param {*} params 参数
     */
    async demoService({
      commit
    }, params) {
      try {
        // method 请求方式 get post delete put
        const {
          method
        } = params
        delete params.method
        const {
          result
        } = await request({
          url: demoURL,
          data: params,
          method,
          commit,
        })
        commit('setDemoList', result)
        return Promise.resolve(result)
      } catch (e) {
        $toast(e.message)
        return Promise.reject(e.messagee)
      }
    },
    /**
     * 获取天气预报资料 不做参考
     */
    async getWeatherService(params) {
      try {
        const data = await axios.get(weatherURL, params, {
          headers: {
            'Access-Control-Allow-Origin': 'http://192.168.1.27:8080',
            "Access-Control-Allow-Headers": "Access-Control-Allow-Headers",
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
          }
        })
        return Promise.resolve(data)
      } catch (e) {
        $toast(e.message)
        return Promise.reject(e.messagee)
      }
    }
  },
  mutations: {
    setDemoList(state, payload) {
      state.demolist = payload
    },
    showLoading(state) {
      state.loading = true;
    },
    finishLoading(state) {
      state.loading = false;
    }
  }
};
