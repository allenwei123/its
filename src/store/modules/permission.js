
export default {
  state: {
    userInfo: localStorage["userInfo"] ? JSON.parse(localStorage["userInfo"]) : null,
  },
  mutations: {
    CHANGE_Token: (state, userInfo) => {
      state.userInfo = userInfo
    }
  },
  actions: {
    changeToken({commit},userInfo) {
      if(userInfo) {
        localStorage.setItem('userInfo',JSON.stringify(userInfo));
      }
      else {
        localStorage.removeItem('userInfo');
      }
      commit('CHANGE_Token',userInfo)
    }
  }
}
