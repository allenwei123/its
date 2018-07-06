import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import permission from './modules/permission'
import tool from './modules/tool'
import data from './modules/data'

import getters from './getters'

Vue.use(ElementUI);
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    permission,
    tool,
    data
  },
  getters
})
