
export default {
    state: {
        isShow:true
    },
    mutations: {
      CHANGE_ASIDE: (state, value) => {
        state.isShow = value
      }
    },
    actions: {
        change_aside({commit},value) {
            commit('CHANGE_ASIDE',value);
        }
  }
}