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
