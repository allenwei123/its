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
  communityId: state => state.data.communityId ,//社区菜单id
  communityName(state) {
    let c = state.data.communityList.find(item => item.id === state.data.communityId);
    return c ? c.name : '';
  },
  communityList: state => state.data.communityList ,//当前用户社区列表
  navIndex: state => state.data.navIndex,//当前头部导航的下标
};
export default new Vuex.Store({
  modules: {
    permission,
    tool,
    data
  },
  getters
})
