
export default {
  state: {
    token: localStorage["userInfo"] ? JSON.parse(localStorage["userInfo"]).token : null
  },
  mutations: {
    CHANGE_Token: (state, newToken) => {
      state.token = newToken
    }
  },
  actions: {
    changeToken({commit},token) {
      commit('CHANGE_Token',token)
    }
  }
}
