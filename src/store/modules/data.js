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
      asideData: aside[1].group,
      permissionData: null ,
      communityId: localStorage["communityId"] ,
      communityList: localStorage["communityList"] ? JSON.parse(localStorage["communityList"]) : null,
      navIndex: 0,
    },
    mutations: {
      CHANGE_ASIDEDATA: (state, newValue) => {
       let a = newValue['d'].filter(item => {
          if(!state.permissionData[item.show]) return false;
          let b = item.menuItem.filter(i => state.permissionData[i.show] == 1);
          item.menuItem = b;
          return true;
        });
          let b = {};
          a.forEach(item => {
            if(item.menuItem.find(v => v.link == newValue.path)){
              b = item.menuItem.find(v => v.link == newValue.path);
            } 
          })
          if(b.link){
            router.push(b.link);
          }else {
            router.push(a[0].menuItem[0].link);//重定向 第一个子集
          }
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
      CLEARPERMISSION: ( state ) => {
        state.permissionData = null;
      },
      NAVINDEX: (state, newValue ) => {
        state.navIndex = newValue;
      }
    },
    actions: {
      changeAsideData({commit,state}, value) {
        if(value.i > 0){
            commit('CHANGE_ASIDEDATA',{d:aside[(value.i)].group,path:value.path});
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
                let obj = formater(res.data.menus);
                commit('UPDATEDPERMISSIONDATA',obj);
                resolve({msg:'success'});
              }
            }).catch(err => {
              reject(err)
            })
        } );
      },
      clearPermission( { commit ,state } ) {
        commit('CLEARPERMISSION');
      },
      updatedNavIndex( { commit ,state } ,value) {
        commit('NAVINDEX',value);
      }
    }
  }
