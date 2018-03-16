import obj1 from '@/mock/mok.json'
import aside from '@/mock/menuList';

function a() {
  let arr = arguments[0];
  let mockData = arguments[1];
  let flag = 0;
  if(arr.length) {
    arr.forEach(item1 => {
      item1.group.forEach(item2 => {
        item2.menuItem.forEach(item3 => {
          if(mockData[flag]=='1' || mockData[flag] == '0') {
            item3.show = mockData[flag];
            flag++;
          }
        })
      })
    });
  }
  return arr;
};
// let mock = '111001111011101110011111110111110101110'; //后台返回的数据
// let sh = mock.split('');// 切割
// const b = a(aside,sh);//模拟返回数据处理

export default {
    state: {
      asideData: aside[0].group,
      communityId: localStorage["communityId"],
      communityList: localStorage["communityList"] ? JSON.parse(localStorage["communityList"]) : null
    },
    mutations: {
      CHANGE_ASIDEDATA: (state, newToken) => {
        state.asideData = newToken
      },
      ADDCOMMUNITYID: (state, newValue) => {
        state.communityId = newValue;
      },
      CGCOMMUNITYLIST: (state, newValue) => {
        state.communityList = newValue;
      }
    },
    actions: {
      changeAsideData({commit,state}, value) {
        commit('CHANGE_ASIDEDATA',aside[value].group)
      },
      addCommunityId({ commit }, value) {
        if(value) {
          localStorage.setItem('communityId',value);
        }
        else {
          localStorage.removeItem('communityId');
        }
        commit('ADDCOMMUNITYID',value)
      },
      cgCommunityList({ commit }, value) {
        if(value) {
          localStorage.setItem('communityList',JSON.stringify(value));
        }
        else {
          localStorage.removeItem('communityList');
        }
        commit('CGCOMMUNITYLIST',value )
      }
    }
  }
