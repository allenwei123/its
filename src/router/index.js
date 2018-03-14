import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import store from '@/store';

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
        redirect: '/home/nav/side',
        component: (resolve) => require(["@/page/home/_res"], resolve),
        children: [
          {
            path: 'side',
            redirect: '/home/nav/side/communityFile',
            component: (resolve) => require(["@/page/home/nav/_res"], resolve),
            children: [
              {
                path: 'test',
                component: (resolve) => require(["@/page/home/nav/property_manage/_res"], resolve),
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
                path: 'carFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/carFile/list"], resolve),
              },
              {
                path: 'property-service/rpass',
                component: (resolve) => require(["@/page/home/nav/property_service/rpass/list"], resolve),
              },
              {
                path: 'property-service/alarm',
                component: (resolve) => require(["@/page/home/nav/property_service/alarm/list"], resolve),
              },
              {
                path: 'property-service/notice',
                component: (resolve) => require(["@/page/home/nav/property_service/notice/list"], resolve),
              },
              {
                path: 'communityFile',
                name: 'communityFile',
                component: (resolve) => require(["@/page/home/nav/property_manage/charge/other"], resolve),
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
                path: 'checkIn',
                component: (resolve) => require(["@/page/home/nav/property_manage/checkIn/checkIn"], resolve)
              },
              {
                path: 'bill',
                component: () => import('@/page/home/nav/property_manage/bill/list')
              },
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
          }, {
            path: 'main',
            component: (resolve) => require(["@/page/home/nav/main"], resolve)
          }]
      },]
    }
  ]
})

router.beforeEach((to, from, next) => {
  next();
})
export default router;

