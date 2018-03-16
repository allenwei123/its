const arr = [
  {
    id:'1',
    name:'物业管理',
    show: 1,
    group:[
      {
        id:'1-1',
        name:'基础管理',
        show: 1,
        menuItem:[
          {
            id:'1-1-1',
            title:'社区档案',
            link:'/home/nav/side/communityFile',
            show: 1
          },
          {
            id:'1-1-2',
            title:'楼栋档案',
            link:'/home/nav/side/floorFile',
            show: 1
          },
          {
            id:'1-1-3',
            title:'房间档案',
            link:'/home/nav/side/roomFile',
            show: 1
          },
          // {
          //   id:'1-1-4',
          //   title:'车库档案',
          //   link:'/home/nav/side/garageport',
          //   show: 1
          // },
          // {
          //   id:'1-1-5',
          //   title:'车位档案',
          //   link:'/home/nav/side/carport',
          //   show: 1
          // },
          {
            id:'1-1-6',
            title:'车辆档案',
            link:'/home/nav/side/carFile',
            show: 1
          }
        ]
      },
      {
        id:'1-2',
        name:'员工管理',
        show: 1,
        menuItem:[
          // {
          //   id:'1-2-1',
          //   title:'角色管理',
          //   link:'/home/nav/side/role',
          //   show: 0
          // },
          {
            id:'1-2-2',
            title:'员工管理',
            link:'/home/nav/side/empl',
            show: 1
          }
        ]
      },
      {
        id:'1-3',
        name:'作业管理',
        show: 1,
        menuItem:[
          {
            id:'1-3-1',
            title:'班次管理',
            link:'/home/nav/side/class',
            show: 1
          },
          {
            id:'1-3-2',
            title:'排班管理',
            link:'/home/nav/side/schedul',
            show: 1
          },
          {
            id:'1-3-3',
            title:'考勤记录',
            link:'/home/nav/side/checkIn',
            show: 1
          }
        ]
      },
      {
        id:'1-4',
        name:'收费管理',
        show: 1,
        menuItem:[
          {
            id:'1-4-1',
            title:'账单管理',
            link:'/home/nav/side/bill',
            show: 1
          }
        ]
      }
    ]
  },
  {
    id:'2',
    name:'物业服务',
    show: 1,
    group:[
      {
        id:'2-1',
        name:'社区服务',
        show: 1,
        menuItem:[
          {
            id:'2-1-1',
            title:'放行条',
            link:'/home/nav/propertyService/rpass',
            show: 1
          },
          {
            id:'2-1-2',
            title:'警报记录',
            link:'/home/nav/propertyService/alarm',
            show: 1
          },
          {
            id:'2-1-3',
            title:'在线服务',
            link:'/home/nav/propertyService/onlineService',
            show: 1
          }
        ]
      },
      {
        id:'2-2',
        name:'投诉报事',
        show: 1,
        menuItem:[
          {
            id:'2-2-1',
            title:'住户投诉',
            link:'/home/nav/propertyService/complaint',
            show: 1
          }
        ]
      },
      {
        id:'2-3',
        name:'故障报修',
        show: 1,
        menuItem:[
          {
            id:'2-3-1',
            title:'故障管理',
            link:'/home/nav/propertyService/fault',
            show: 1
          }
        ]
      },
      {
        id:'2-4',
        name:'社区动态',
        show: 1,
        menuItem:[
          {
            id:'2-4-1',
            title:'动态消息',
            link:'/home/nav/propertyService/message',
            show: 1
          }
        ]
      },
      {
        id:'2-5',
        name:'消息管理',
        show: 1,
        menuItem:[
          {
            id:'2-5-1',
            title:'社区公告',
            link:'/home/nav/propertyService/notice',
            show: 1
          }
        ]
      }
    ]
  },
  {
    id:'3',
    name:'社区物联',
    show: 1,
    group:[
      {
        id:'3-1',
        name:'电梯管理',
        show: 1,
        menuItem:[
          {
            id:'3-1-1',
            title:'电梯档案',
            link:'/home/nav/communityIoT/elevator',
            show: 1
          },
          {
            id:'3-1-2',
            title:'维修记录',
            link:'/home/nav/communityIoT/record',
            show: 1
          }
        ]
      },
      {
        id:'3-2',
        name:'门禁管理',
        show: 1,
        menuItem:[
          {
            id:'3-2-1',
            title:'门禁档案',
            link:'/home/nav/communityIoT/door',
            show: 1
          }
        ]
      },
      {
        id:'3-3',
        name:'监控管理',
        show: 1,
        menuItem:[
          {
            id:'3-3-1',
            title:'设备监控',
            link:'/home/nav/communityIoT/monitoringD',
            show: 1
          },
          {
            id:'3-3-2',
            title:'实时监控',
            link:'/home/nav/communityIoT/monitoringC',
            show: 1
          }
        ]
      },
      {
        id:'3-4',
        name:'停车管理',
        show: 1,
        menuItem:[
          {
            id:'3-4-1',
            title:'停车设备',
            link:'/home/nav/communityIoT/parkinglotDevice',
            show: 1
          }
        ]
      },
      {
        id:'3-5',
        name:'一卡通管理',
        show: 1,
        menuItem:[
          {
            id:'3-5-1',
            title:'一卡通档案',
            link:'/home/nav/communityIoT/onePass',
            show: 1
          },
          {
            id:'3-5-2',
            title:'使用记录',
            link:'/home/nav/communityIoT/userRecord',
            show: 1
          }
        ]
      }
    ]
  }
]
export default arr;
