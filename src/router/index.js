import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    { path: '/login', name: 'login', component: (resolve) => require(["@/container/views/login"], resolve) },
    { path: '/404',name:'error', component: (resolve) => require(["@/container/views/err"], resolve) }
  ]
});

const authRouterMap = [
  {
    name:'首页',
    path: '/home',
    redirect: '/home/projectManagement',
    component: (resolve) => require(["@/container/views/content"], resolve),
    meta:{},
    children: [
      {
        path: 'projectManagement',
        component: (resolve) => require(["@/container/pages/one/base"], resolve),
        meta:{ show: '1100', title: '项目管理'},
        children:[
          {
            path: 'add',
            component: (resolve) => require(["page/one/base/addPage"], resolve),
            meta:{ show: '1110', title: '新增' }
          }
        ]
      },
      {
        path: 'a',
        component: (resolve) => require(["@/container/pages/one/base/a"], resolve),
        meta:{ show: '1110', title: '房间管理'}
      },
      {
        path: 'b',
        component: (resolve) => require(["@/container/pages/one/base/b"], resolve),
        meta:{ show: '1130', title: '楼栋管理'}
      }
    ]
  },
  // { path: '*', redirect: '/404', hidden: true }
];

let isFirstInto = true;

let userFilterRouter = function(authRouterMap, userConfig) {
  let a = authRouterMap[0].children.filter(item => {
    if(item.meta.show) {
      if(userConfig[item.meta.show] === '1') {//判断当前是否有权限
        if(item.children) {
          let b = item.children.filter( o => {
            if(userConfig[o.meta.show] === '1') {//判断当前子集是否有权限
              return true;
            }
            return false;
          })
          item.children = b;
        }
        return true
      }else {
        return false
      }
    }else {//判断是否有meta 属性
      return false
    }
  })
  authRouterMap[0].children = a;
  console.log(a)
  return authRouterMap;
}

let isLogin = function () {
  return localStorage.getItem('userInfo');
}

router.beforeEach((to, from, next) => {
  if(!isLogin && to.path !== '/login') {//本地未登陆 且 非登陆页
    return  next('/login')
  }else if(isFirstInto && to.path !== '/login'){
    isFirstInto = false;
    setTimeout(()=> {
      let userPerms = {'1100': '1', '1110': '1','1130': '1'};// 模拟后台返回数据
      let accessedRouters = userFilterRouter(authRouterMap, userPerms);
      router.addRoutes(accessedRouters);
    },500)
  }
  next();
})

export default router;

