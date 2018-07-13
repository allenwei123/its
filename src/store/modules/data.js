import aside from '@/mock/menuList';
import http from '@/utils/request';

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
      asideData: aside,
      permissionData: null ,
      navIndex: 0,
    },
    mutations: {
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
