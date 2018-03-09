import obj1 from '@/mock/mok.json'

function getData () {
    let arr = ['side','property_service','communityIoT'];
    // let currentIndex = arr.indexOf(this.$route.path.split('/')[3]);
    // this.arrData = obj1.data[currentIndex].children;
}
export default {
    state: {
      asideData: obj1.data[0].children
    },
    mutations: {
      CHANGE_ASIDEDATA: (state, newToken) => {
        state.asideData = newToken
      }
    },
    actions: {
      changeAsideData({commit}, value) {
        let arr = ['side','property_service','communityIoT'];
        commit('CHANGE_ASIDEDATA',obj1.data[value].children)
      }
    }
  }