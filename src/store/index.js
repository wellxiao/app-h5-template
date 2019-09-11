import app from './app'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import Vue from 'vue'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const plugins = []

if (debug) plugins.push(createLogger())

export default new Vuex.Store({
  modules: {
      app,
  },
  strict: debug,
  plugins,
})
