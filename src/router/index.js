import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    { path: '/auth/login', name: 'login', component: (resolve) => require(["@/page/auth/login"], resolve) },
    { path: '/auth/logout', component: (resolve) => require(["@/page/auth/logout"], resolve) },
    { path: '/404', component: (resolve) => require(["@/page/error"], resolve) },
    {
      path: '/home',
      redirect: '/home/nav',
      component: App,
      children: [{
        path: 'nav',
        redirect: '/home/nav/main',
        component: (resolve) => require(["@/page/home/_res"], resolve),
        children: [
          //基础管理
          {
            path: 'side',
            name:'11b0',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'test',
                component: (resolve) => require(["@/page/home/nav/property_manage/_res"], resolve),
              },
              {
                path: 'content',
                component: (resolve) => require(["@/page/home/nav/content/_res"], resolve),
              },
              {
                path: 'floorFile',
                name:'1100',
                component: (resolve) => require(["@/page/home/nav/property_manage/floorFile/list"], resolve),
              },
              {
                path: 'roomFile',
                name:'1110',
                component: (resolve) => require(["@/page/home/nav/property_manage/roomFile/list"], resolve),
              },
              {
                path: 'promiseFile',
                name:'1130',
                component: (resolve) => require(["@/page/home/nav/property_manage/promiseFile/list"], resolve),
              },
              {
                path: 'carFile',
                name:'1150',
                component: (resolve) => require(["@/page/home/nav/property_manage/carFile/list"], resolve),
              },
              {
                path: 'carport',
                name:'1140',
                component: (resolve) => require(["@/page/home/nav/property_manage/carport/carport"], resolve),
              },
              // {
              //   path: 'communityFile',
              //   name: 'communityFile',
              //   component: (resolve) => require(["@/page/home/nav/property_manage/charge/other"], resolve),
              // },
              {
                path: 'charge',
                name:'11D0',
                component: (resolve) => require(["@/page/home/nav/property_manage/charge/charge"], resolve)
              },
              {
                path: 'userFile',
                name:'1120',
                component: (resolve) => require(["@/page/home/nav/property_manage/userFile/list"], resolve),
              },
              {
                path: 'role',
                name:'1160',
                component: (resolve) => require(["@/page/home/nav/property_manage/role/role"], resolve),
              },
              {
                path: 'empl',
                name:'1170',
                component: (resolve) => require(["@/page/home/nav/property_manage/empl/empl"], resolve),
              },
              {
                path: 'schedul',
                name:'1190',
                component: (resolve) => require(["@/page/home/nav/property_manage/schedul/schedul"], resolve),
              },
              {
                path: 'class',
                name:'1180',
                component: (resolve) => require(["@/page/home/nav/property_manage/class/class"], resolve),
              },
              {
                path: 'security',
                name:'11A0',
                component: (resolve) => require(["@/page/home/nav/property_manage/security/security"], resolve)
              },
              {
                path: 'cleaner',
                name:'11B0',
                component: (resolve) => require(["@/page/home/nav/property_manage/cleaner/cleaner"], resolve)
              },
              {
                path: 'checkIn',
                component: (resolve) => require(["@/page/home/nav/property_manage/checkIn/checkIn"], resolve)
              },
              {
                path: 'bill',
                name:'11C0',
                component: (resolve) => require(["@/page/home/nav/property_manage/bill/list"], resolve)
              },
              {
                path: 'slideshow',
                name:'11Z0',
                component: (resolve) => require(["@/page/home/nav/property_manage/slideshow/list"], resolve)
              }
            ]
          },
          // 物业服务
          {
            path: 'propertyService',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'rpass',
                name:'11E0',
                component: (resolve) => require(["@/page/home/nav/property_service/rpass/list"], resolve)
              },
              {
                path: 'alarm',
                name:'11F0',
                component: (resolve) => require(["@/page/home/nav/property_service/alarm/list"], resolve)
              },
              {
                path: 'notice',
                name:'11K0',
                component: (resolve) => require(["@/page/home/nav/property_service/notice/list"], resolve)
              },
              {
                path: 'complaint',
                name:'11H0',
                component: (resolve) => require(["@/page/home/nav/property_service/complaint/list"], resolve)
              },
              {
                path: 'fault',
                name:'11I0',
                component: (resolve) => require(["@/page/home/nav/property_service/fault/list"], resolve)
              },
              {
                path: 'message',
                name:'11J0',
                component: (resolve) => require(["@/page/home/nav/property_service/message/list"], resolve)
              },
              {
                path: 'silent',
                name:'11J0',
                component: (resolve) => require(["@/page/home/nav/property_service/silent"], resolve)
              },
              {
                path: 'messageDetail',
                name:'11J0',
                component: (resolve) => require(["@/page/home/nav/property_service/message/detail"], resolve)
              },
              {
                path: 'inform',
                name:'11y2',
                component: (resolve) => require(["@/page/home/nav/property_service/inform/list"], resolve)
              },
              {
                path: 'informDetail',
                // name:'11yB',
                name: '11y2',
                component: (resolve) => require(["@/page/home/nav/property_service/inform/detail"], resolve)
              },
              {
                path: 'onlineService',
                name:'11G0',
                component: (resolve) => require(["@/page/home/nav/property_service/online"], resolve)
              }
            ]
          },
          // 社区物联
          {
            path: 'communityIoT',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'elevator',
                name:'11L0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/list"], resolve)
              },
              {
                path: 'repair',
                name:'11L0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/repair"], resolve)
              },
              {
                path: 'elevatorFault',
                name:'11M0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/fault"], resolve)
              },
              {
                path: 'elevatorRecord',
                name:'11L2',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/record"], resolve)
              },
              {
                path: 'door',
                name:'11N0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/door/list"], resolve)
              },
              {
                path: 'doorRecord',
                name:'11N2',
                component: (resolve) => require(["@/page/home/nav/communityIoT/door/record"], resolve)
              },
              {
                path: 'parkinglotDevice',
                name:'11Q0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/parkinglot/device/list"], resolve)
              },
              {
                path: 'parkinglotRecord',
                name:'11Q2',
                component: (resolve) => require(["@/page/home/nav/communityIoT/parkinglot/record/list"], resolve)
              },
              {
                path: 'monitoringD',
                name:'11O0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/monitoring/devices"], resolve)
              },
              {
                path: 'monitoringC',
                name:'11P0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/monitoring/currentT"], resolve)
              },
              {
                path: 'onePass',
                name:'11R0',
                component: (resolve) => require(["@/page/home/nav/communityIoT/onePass/list"], resolve)
              },
            ]
          },
          //商圈管理
          {
            path: 'businessManage',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'merchant',
                name:'11S0',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant"], resolve)
              },
              {
                path: 'amenity',
                name:'11U0',
                component: (resolve) => require(["@/page/home/nav/businessManage/amenity/list"], resolve)
              },
              {
                path: 'slideShow',
                name:'11T0',
                component: (resolve) => require(["@/page/home/nav/businessManage/slideShow/index"], resolve)
              },
              {
                path: 'recommend',
                name:'11S3',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant/recommend"], resolve)
              },
              {
                path: 'coupon',
                name:'11S4',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant/coupon"], resolve)
              }
            ]
          },
          //统计管理
          {
            path: 'summary',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'baseInfo',
                name:'11br',
                component: (resolve) => require(["@/page/home/nav/summary/baseInfo"], resolve)
              },
              {
                path: 'alarm',
                name: '11bs',
                component: (resolve) => require(["@/page/home/nav/summary/alarm"], resolve)
              },
              {
                path: 'payment',
                name: '11bt',
                component: (resolve) => require(["@/page/home/nav/summary/payment"], resolve)
              },
              {
                path: 'equipment',
                name: '11bu',
                component: (resolve) => require(["@/page/home/nav/summary/equipment"], resolve)
              },
            ]
          },
          {
            path: 'main',
            name: '11a0',
            component: (resolve) => require(["@/page/home/nav/main"], resolve)
          }]
      },]
    }
  ]
});
let currentNav = '';
let errorList = ['/home/nav/communityIoT/record'];//记录暂时没开发的
router.beforeEach((to, from, next) => {
  let arr = ['main','side','propertyService','communityIoT','businessManage','summary'];

  if(!store.getters.pms && store.getters.communityId && localStorage.getItem('userInfo') ) {//首次加载 获取rules
    store.dispatch('updatedPermission')
      .then(ev => {
        if(ev.msg) {
         next(to.path);
        }
      });
    return next(false);
  };

  if(store.getters.pms && store.getters.pms[to.name] == 0 ) {
   return next('/404');
  }

  if(to.path.split('/')[3] && currentNav !== to.path.split('/')[3]){
    let currentIndex = arr.findIndex(item => item == to.path.split('/')[3]);
    currentNav = to.path.split('/')[3];
    store.dispatch('changeAsideData',currentIndex );
    store.dispatch('updatedNavIndex',currentIndex );
  }

  let isLogin = function () {
    return localStorage.getItem('userInfo');
  }
  if(errorList.find((val) => { return val == to.path})) {
    alert('该功能未开发');
    next(false);
  }else if(to.path === '/auth/login' && !isLogin()){//跳转到登陆页
    return next();
  }else{
    if(!isLogin()) {//判断是否登陆
      return  next('/auth/login')
    }else {
      next();
    }
  }

  // if(to.path == a)

})
export default router;

