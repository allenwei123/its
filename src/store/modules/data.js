import obj1 from '@/mock/mok.json'
import aside from '@/mock/menuList';
import http from '@/utils/request';

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

export default {
    state: {
      asideData: aside[0].group,
      allAside:[],
      communityId: localStorage["communityId"] ,
      communityList: localStorage["communityList"] ? JSON.parse(localStorage["communityList"]) : null
    },
    mutations: {
      CHANGE_ASIDEDATA: (state, newValue) => {
        state.asideData = newValue
      },
      ADDCOMMUNITYID: (state, newValue) => {
        state.communityId = newValue;
      },
      CGCOMMUNITYLIST: (state, newValue) => {
        state.communityList = newValue;
      },
      UPDATEDASIDEDATA: (state, newValue ) => {
        state.allAside = newValue;
        if(newValue){
          state.asideData = newValue[0].group;
        }else {
          state.asideData = [];
        }
      }
    },
    actions: {
      changeAsideData({commit,state}, value) {
        if(value > -1){
          commit('CHANGE_ASIDEDATA',state.allAside[value].group)
        }
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
      },
      updatedAsideData( { commit ,state }) {
        return new Promise((resolve, reject) => {
          http.get(`/sys/menu/${state.communityId}/getByOuterKey`)
            .then(res => {
              let menuList =res.data?a(aside,res.data.spread.split('')) : null;
              // console.log(menuList)
              commit('UPDATEDASIDEDATA', menuList);
              resolve({msg:'success'})
            }).catch(err => {
              reject(err)
            })
        } )
      }
    }
  }
