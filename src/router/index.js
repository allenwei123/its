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
      redirect:'/home',
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
        children:[
          {
            path: 'side',
            redirect: '/home/nav/side/other',
            component: r => require.ensure([], () => r(require('../page/home/nav/_res')), 'nav'),
            children:[
              {
                path: 'floorFile',
                component: () => import('@/page/home/nav/content/floorFile/list')
              },
              {
                path: 'rpass',
                component: () => import('@/page/home/nav/property_service/rpass/list')
              },
              {
                path: 'alarm',
                component: () => import('@/page/home/nav/property_service/alarm/list')
              },
              {
                path: 'notice',
                component: () => import('@/page/home/nav/property_service/notice/list')
              },
              {
                path: 'complaint',
                component: () => import('@/page/home/nav/property_service/complaint/list')
              },
              {
                path: 'other',
                name:'dangan',
                component: r => require.ensure([], () => r(require('../page/home/nav/content/charge/other')), 'side')
              },
              {
                path: 'empl/role',
                component: r => require.ensure([], () => r(require('@/page/home/nav/content/empl/role')), 'side')
              },
              {
                path: 'empl/empl',
                component: r => require.ensure([], () => r(require('@/page/home/nav/content/empl/empl')), 'side')
              },
              {
                path: 'work/schedul',
                component: r => require.ensure([], () => r(require('@/page/home/nav/content/work/schedul')), 'side')
              },
              {
                path: 'work/attendance',
                component: r => require.ensure([], () => r(require('@/page/home/nav/content/work/attendance')), 'side')
              }
            ]
          }]
      }, {
        path: 'about',
        component: r => require.ensure([], () => r(require('../page/item')), 'item')
      }]
    }
  ]
})
