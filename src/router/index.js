import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/Home'
import App from '../App'
import Login from '@/page/auth/login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/home',
      component: App
    },
    {
      path: '/auth/login',
      component: Login
    },
    {
      path: '/home',
      redirect: '/home/nav',
      component: App,
      children: [{
        path: 'nav',
        redirect: '/home/nav/side',
        component: r => require.ensure([], () => r(require('../page/home')), 'home'),
        children:[
          {
            path: 'side',
            redirect: '/home/nav/side/other',
            component: r => require.ensure([], () => r(require('../page/home/nav')), 'nav'),
            children:[
              {
                path: 'content',
                component: r => require.ensure([], () => r(require('../page/home/nav/content')), 'side')
              },
              {
                path: 'other',
                component: r => require.ensure([], () => r(require('../page/home/nav/content/other')), 'side')
              }]
          }]
      }, {
        path: 'about',
        component: r => require.ensure([], () => r(require('../page/item')), 'item')
      }]
    },
    {
      path: '/index',
      component: r => require.ensure([], () => r(require('../page/index')), 'index')
    }
  ]
})
