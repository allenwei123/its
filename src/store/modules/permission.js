
export default {
  state: {
    token:'123'
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
