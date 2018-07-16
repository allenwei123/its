const arr = [
  {
    id:'1-1',
    name:'项目管理',
    show: '11b6',
    link:'/home/projectManagement',
    menuItem: null
  },
  {
    id:'1-2',
    name:'员工管理',
    show: '11b7',
    menuItem:[
      {
        id:'1-2-1',
        title:'角色管理',
        link:'/home/a',
        show: '1160'
      },
      {
        id:'1-2-2',
        title:'员工管理',
        link:'/home/nav/side/empl',
        show: '1170'
      },
      {
        id:'1-2-3',
        title:'辖区管理',
        link:'/home/nav/side/popedom',
        show: '1170'
      }
    ]
  },
  {
    id:'1-3',
    name:'工作管理',
    show: '11b8',
    menuItem:[
      {
        id:'1-3-1',
        title:'班次管理',
        link:'/home/nav/side/class',
        show: '1180'
      },
      {
        id:'1-3-2',
        title:'排班管理',
        link:'/home/nav/side/schedul',
        show: '1190'
      },
      {
        id:'1-3-3',
        title:'保安考勤',
        link:'/home/nav/side/security',
        show: '11A0'
      },
      {
        id:'1-3-3',
        title:'保洁考勤',
        link:'/home/nav/side/cleaner',
        show: '11B0'
      }
    ]
  },
  {
    id:'1-4',
    name:'收费管理',
    show: '11b9',
    menuItem:[
      {
        id:'1-4-1',
        title:'收费管理',
        link:'/home/nav/side/charge',
        show: '11D0'
      },
      {
        id:'1-4-2',
        title:'账单管理',
        link:'/home/nav/side/bill',
        show: '11C0'
      },
      
    ]
  },{
    id:'1-4',
    name:'设备管理',
    show: '11b9',
    link:'/home/b',
    menuItem: null
  }
]
export default arr;