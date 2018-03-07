import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import App from '../App'

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
                path: 'content',
                component: r => require.ensure([], () => r(require('../page/home/nav/content/_res')), 'side')
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
                name:'dangan',
                component: r => require.ensure([], () => r(require('../page/home/nav/content/charge/other')), 'side')
              }]
          }]
      }, {
        path: 'about',
        component: r => require.ensure([], () => r(require('../page/item')), 'item')
      }]
    }
  ]
})
