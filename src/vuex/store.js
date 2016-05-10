import Vuex from 'vuex'
import Vue from 'vue'
import map from './modules/map'

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    map
  },
  strict: debug
})
