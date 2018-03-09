import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import permission from './modules/permission'
import tool from './modules/tool'
import data from './modules/data'

Vue.use(ElementUI);
Vue.use(Vuex);

const getters = {
  token: (state) => state.permission.userInfo ? state.permission.userInfo.token : null,
  uid: (state) => state.permission.userInfo ? state.permission.userInfo.id : null,
  userInfo: (state) => state.permission.userInfo.id,
  showAside: state => state.tool.isShow ,//判断侧边栏
  asideData: state => state.data.asideData ,//侧边栏数据
}
export default new Vuex.Store({
  modules: {
    permission,
    tool,
    data
  },
  getters
})
