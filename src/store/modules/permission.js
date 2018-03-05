
export default {
  state: {
    userInfo: localStorage["userInfo"] ? JSON.parse(localStorage["userInfo"]) : null
  },
  mutations: {
    CHANGE_Token: (state, newToken) => {
      state.userInfo = newToken
    }
  },
  actions: {
    changeToken({commit},userInfo) {
      if(userInfo) {
        localStorage.setItem('userInfo',JSON.stringify(userInfo));
        commit('CHANGE_Token',userInfo)
      }
    }
  }
}
