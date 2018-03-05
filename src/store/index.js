import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import permission from './modules/permission'

Vue.use(ElementUI);
Vue.use(Vuex);

const state = {
	level: '第34周', //活动周数
	itemNum: 1, // 第几题
	allTime: 0,  //总共用时
	timer: '', //定时器
	answerid: [], //答案id
	arr:[],
  showContent:true
}
const getters = {
  token: (state) => state.permission.userInfo ? state.permission.userInfo.token : null,
  uid: (state) => state.permission.userInfo ? state.permission.userInfo.id : null,
  userInfo: (state) => state.permission.userInfo.id
}
export default new Vuex.Store({
  modules: {
    permission
  },
  getters
})
