import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import App from '../App'
import { request } from 'https';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home',
      component: App
    },
    { path: '/auth/login', component: () => import('@/page/auth/login') },
    { path: '/auth/logout', component: () => import('@/page/auth/logout') },
    {
      path: '/home',
      redirect: '/home/nav',
      component: App,
      children: [{
        path: 'nav',
        redirect: '/home/nav/side',
        component: r => require.ensure([], () => r(require('../page/home/_res')), 'home'),
        children: [
          {
            path: 'side',
            redirect: '/home/nav/side/other',
            component: r => require.ensure([], () => r(require('../page/home/nav/_res')), 'nav'),
            children: [
              {
                path: 'test',
                component: () => import('@/page/home/nav/property_manage/_res')
              },
              {
                path: 'floorFile',
                component: () => import('@/page/home/nav/property_manage/floorFile/list')
              },
              {
                path: 'roomFile',
                component: () => import('@/page/home/nav/property_manage/roomFile/list')
              },
              {
                path: 'property-service/rpass',
                component: () => import('@/page/home/nav/property_service/rpass/list')
              },
              {
                path: 'property-service/alarm',
                component: () => import('@/page/home/nav/property_service/alarm/list')
              },
              {
                path: 'property-service/notice',
                component: () => import('@/page/home/nav/property_service/notice/list')
              },
              {
                path: 'other',
                name: 'dangan',
                component: r => require.ensure([], () => r(require('../page/home/nav/property_manage/charge/other')), 'side')
              },
              {
                path: 'userFile',
                component: r => require.ensure([], () => r(require('../page/home/nav/property_manage/userFile/list')), 'side')
              },
              {
                path: 'role',
                component: r => require.ensure([], () => r(require('@/page/home/nav/property_manage/role/role')), 'side')
              },
              {
                path: 'empl',
                component: r => require.ensure([], () => r(require('@/page/home/nav/property_manage/empl/empl')), 'side')
              },
              {
                path: 'schedul',
                component: r => require.ensure([], () => r(require('@/page/home/nav/property_manage/schedul/schedul')), 'side')
              },
              {
                path: 'class',
                component: r => require.ensure([], () => r(require('@/page/home/nav/property_manage/class/class')), 'side')
              },
              // {
              //   path: 'work/attendance',
              //   component: r => require.ensure([], () => r(require('@/page/home/nav/property_manage/work/attendance')), 'side')
              // }
            ]
          },
          // 物业服务
          {
            path: 'propertyService',
            redirect: 'propertyService/rpass',
            component: () => import('@/page/home/nav/_res'),
            children: [
              { path: 'rpass', component: () => import('@/page/home/nav/property_service/rpass/list') },
              { path: 'alarm', component: () => import('@/page/home/nav/property_service/alarm/list') },
              { path: 'notice', component: () => import('@/page/home/nav/property_service/notice/list') },
              { path: 'complaint', component: () => import('@/page/home/nav/property_service/complaint/list') },
              { path: 'fault', component: () => import('@/page/home/nav/property_service/fault/list') },
              { path: 'message', component: () => import('@/page/home/nav/property_service/message/list') }
            ]
          },
          // 社区物联
          {
            path: 'communityIoT',
            redirect: 'communityIoT/elevator',
            component: () => import('@/page/home/nav/_res'),
            children: [
              { path: 'elevator', component: () => import('@/page/home/nav/communityIoT/elevator/list') },
              { path: 'elevatorFault', component: () => import('@/page/home/nav/communityIoT/elevator/fault') },
              { path: 'elevatorRecord', component: () => import('@/page/home/nav/communityIoT/elevator/record') },
              { path: 'door', component: () => import('@/page/home/nav/communityIoT/door/list') },
              { path: 'doorRecord', component: () => import('@/page/home/nav/communityIoT/door/record') },
              { path: 'parkinglotDevice', component: () => import('@/page/home/nav/communityIoT/parkinglot/device/list') },
              { path: 'parkinglotRecord', component: () => import('@/page/home/nav/communityIoT/parkinglot/record/list') },
              { path: 'monitoringD', component: () => import('@/page/home/nav/communityIoT/monitoring/devices') },
              { path: 'monitoringC', component: () => import('@/page/home/nav/communityIoT/monitoring/currentT') }
            ]
          }]
      },]
    }
  ]
})
