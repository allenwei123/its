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
    {
      path: '/home',
      redirect: '/home/nav',
      component: App,
      children: [{
        path: 'nav',
        redirect: '/home/nav/main',
        component: (resolve) => require(["@/page/home/_res"], resolve),
        children: [
          {
            path: 'side',
            redirect: '/home/nav/side/floorFile',
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
                component: (resolve) => require(["@/page/home/nav/property_manage/floorFile/list"], resolve),
              },
              {
                path: 'roomFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/roomFile/list"], resolve),
              },
              {
                path: 'promiseFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/promiseFile/list"], resolve),
              },
              {
                path: 'carFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/carFile/list"], resolve),
              },
              {
                path: 'carport',
                component: (resolve) => require(["@/page/home/nav/property_manage/carport/carport"], resolve),
              },
              // {
              //   path: 'communityFile',
              //   name: 'communityFile',
              //   component: (resolve) => require(["@/page/home/nav/property_manage/charge/other"], resolve),
              // },
              {
                path: 'charge',
                component: (resolve) => require(["@/page/home/nav/property_manage/charge/charge"], resolve)
              },
              {
                path: 'userFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/userFile/list"], resolve),
              },
              {
                path: 'role',
                component: (resolve) => require(["@/page/home/nav/property_manage/role/role"], resolve),
              },
              {
                path: 'empl',
                component: (resolve) => require(["@/page/home/nav/property_manage/empl/empl"], resolve),
              },
              {
                path: 'schedul',
                component: (resolve) => require(["@/page/home/nav/property_manage/schedul/schedul"], resolve),
              },
              {
                path: 'class',
                component: (resolve) => require(["@/page/home/nav/property_manage/class/class"], resolve),
              },
              {
                path: 'security',
                component: (resolve) => require(["@/page/home/nav/property_manage/security/security"], resolve)
              },
              {
                path: 'cleaner',
                component: (resolve) => require(["@/page/home/nav/property_manage/cleaner/cleaner"], resolve)
              },
              {
                path: 'checkIn',
                component: (resolve) => require(["@/page/home/nav/property_manage/checkIn/checkIn"], resolve)
              },
              {
                path: 'bill',
                component: (resolve) => require(["@/page/home/nav/property_manage/bill/list"], resolve)
              },
              {
                path: 'slideshow',
                component: (resolve) => require(["@/page/home/nav/property_manage/slideshow/list"], resolve)
              }
            ]
          },
          // 物业服务
          {
            path: 'propertyService',
            redirect: 'propertyService/rpass',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'rpass',
                component: (resolve) => require(["@/page/home/nav/property_service/rpass/list"], resolve)
              },
              {
                path: 'alarm',
                component: (resolve) => require(["@/page/home/nav/property_service/alarm/list"], resolve)
              },
              {
                path: 'notice',
                component: (resolve) => require(["@/page/home/nav/property_service/notice/list"], resolve)
              },
              {
                path: 'complaint',
                component: (resolve) => require(["@/page/home/nav/property_service/complaint/list"], resolve)
              },
              {
                path: 'fault',
                component: (resolve) => require(["@/page/home/nav/property_service/fault/list"], resolve)
              },
              {
                path: 'message', component: (resolve) => require(["@/page/home/nav/property_service/message/list"], resolve)
              },
              {
                path: 'onlineService', component: (resolve) => require(["@/page/home/nav/property_service/online"], resolve)
              }
            ]
          },
          // 社区物联
          {
            path: 'communityIoT',
            redirect: 'communityIoT/elevator',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'elevator',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/list"], resolve)
              },
              {
                path: 'repair',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/repair"], resolve)
              },
              {
                path: 'elevatorFault',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/fault"], resolve)
              },
              {
                path: 'elevatorRecord',
                component: (resolve) => require(["@/page/home/nav/communityIoT/elevator/record"], resolve)
              },
              {
                path: 'door',
                component: (resolve) => require(["@/page/home/nav/communityIoT/door/list"], resolve)
              },
              {
                path: 'doorRecord',
                component: (resolve) => require(["@/page/home/nav/communityIoT/door/record"], resolve)
              },
              {
                path: 'parkinglotDevice',
                component: (resolve) => require(["@/page/home/nav/communityIoT/parkinglot/device/list"], resolve)
              },
              {
                path: 'parkinglotRecord',
                component: (resolve) => require(["@/page/home/nav/communityIoT/parkinglot/record/list"], resolve)
              },
              {
                path: 'monitoringD',
                component: (resolve) => require(["@/page/home/nav/communityIoT/monitoring/devices"], resolve)
              },
              {
                path: 'monitoringC',
                component: (resolve) => require(["@/page/home/nav/communityIoT/monitoring/currentT"], resolve)
              },
              {
                path: 'onePass',
                component: (resolve) => require(["@/page/home/nav/communityIoT/onePass/list"], resolve)
              },
            ]
          },
          //商圈管理
          {
            path: 'businessManage',
            redirect: 'businessManage/merchant',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'merchant',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant"], resolve)
              },
              {
                path: 'amenity',
                component: (resolve) => require(["@/page/home/nav/businessManage/amenity/list"], resolve)
              },
              {
                path: 'slideShow',
                component: (resolve) => require(["@/page/home/nav/businessManage/slideShow/index"], resolve)
              },
              { path: 'recommend',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant/recommend"], resolve)
              },
              {
                path: 'coupon',
                component: (resolve) => require(["@/page/home/nav/businessManage/merchant/coupon"], resolve)
              }
            ]
          },
          {
            path: 'summary',
            redirect: 'summary/baseInfo',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'baseInfo',
                component: (resolve) => require(["@/page/home/nav/summary/baseInfo"], resolve)
              }
            ]
          },
          {
            path: 'main',
            component: (resolve) => require(["@/page/home/nav/main"], resolve)
          }]
      },]
    }
  ]
});
let currentNav = '';
let errorList = ['/home/nav/communityIoT/record','/home/nav/propertyService/message'];//记录暂时没开发的
router.beforeEach((to, from, next) => {
  let arr = ['main','side','propertyService','communityIoT','businessManage','summary'];
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

