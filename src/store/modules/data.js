import aside from '@/mock/menuList';
import http from '@/utils/request';
import router from '@/router/index';

function formater(arr) {
  if(Array.isArray(arr)) {
    let o = {};
    for(let i = 0,len = arr.length;i < len;i++ ){
      let str = arr[i];
      let key = str.substring(0,4);
      let val = + str.substring(4,5);
      o[key] = val;
    };
    return o;
  }
}
export default {
    state: {
      asideData: aside[0].group,
      permissionData: null ,
      communityId: localStorage["communityId"] ,
      communityList: localStorage["communityList"] ? JSON.parse(localStorage["communityList"]) : null,
      navIndex: 0,
    },
    mutations: {
      CHANGE_ASIDEDATA: (state, newValue) => {
       let a = newValue.filter(item => {
          if(!state.permissionData[item.show]) return false;
          let b = item.menuItem.filter(i => state.permissionData[i.show] == 1);
          item.menuItem = b;
          return true;
        });
        router.push(a[0].menuItem[0].link);//重定向 第一个子集
        state.asideData = a;
      },
      ADDCOMMUNITYID: (state, newValue) => {
        state.communityId = newValue;
      },
      CGCOMMUNITYLIST: (state, newValue) => {
        state.communityList = newValue;
      },
      UPDATEDPERMISSIONDATA: (state, newValue ) => {
        state.permissionData = newValue;
      },
      NAVINDEX: (state, newValue ) => {
        state.navIndex = newValue;
      }
    },
    actions: {
      changeAsideData({commit,state}, value) {
        if(value > 0){
            commit('CHANGE_ASIDEDATA',aside[value].group);
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
      updatedPermission( { commit ,state }) {
        return new Promise((resolve, reject) => {
          http.get(`/community/config`)
            .then(res => {
              if(!res.errorCode) {
                console.log(res.data.menus);
                let obj = formater(res.data.menus);
                commit('UPDATEDPERMISSIONDATA',obj);
                resolve({msg:'success'});
              }
            }).catch(err => {
              reject(err)
            })
        } );
      },
      updatedNavIndex( { commit ,state } ,value) {
        commit('NAVINDEX',value);
      }
    }
  }
