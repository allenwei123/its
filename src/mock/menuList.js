const arr = [
  {
    id: '0',
    name: '首页',
    show: '11a0',
    src: '/home/nav/main'
  },
  {
    id:'1',
    name:'物业管理',
    show: '11b0',
    src: '/home/nav/side',
    group:[
      {
        id:'1-1',
        name:'基础管理',
        show: '11b6',
        menuItem:[
          // {
          //   id:'1-1-1',
          //   title:'社区档案',
          //   link:'/home/nav/side/communityFile',
          //   show: 1
          // },
          {
            id:'1-1-2',
            title:'楼栋档案',
            link:'/home/nav/side/floorFile',
            show: '1100'
          },
          {
            id:'1-1-3',
            title:'房间档案',
            link:'/home/nav/side/roomFile',
            show: '1110'
          },
          {
            id: '1-1-4',
            title: '住户档案',
            link:'/home/nav/side/userFile',
            show: '1120'
          },
          {
            id:'1-1-5',
            title:'住户认证',
            link:'/home/nav/side/promiseFile',
            show: '1130'
          },
          {
            id:'1-1-6',
            title:'车辆认证',
            link:'/home/nav/side/carFile',
            show: '1140'
          },
          {
            id:'1-1-7',
            title:'车库档案',
            link:'/home/nav/side/carport',
            show: '1150'
          },
          {
            id:'1-5-1',
            title: '轮播图管理',
            link:'/home/nav/side/slideshow',
            show: '11s0'
          }
        ]
      },
      {
        id:'1-2',
        name:'员工管理',
        show: '11b7',
        menuItem:[
          {
            id:'1-2-1',
            title:'角色管理',
            link:'/home/nav/side/role',
            show: '1160'
          },
          {
            id:'1-2-2',
            title:'员工管理',
            link:'/home/nav/side/empl',
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
          },
          // {
          //   id:'1-3-4',
          //   title:'考勤管理',
          //   link:'/home/nav/side/checkIn',
          //   show: 1
          // }
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
      },
    ]
  },
  {
    id:'2',
    name:'物业服务',
    show: '11b1',
    src: '/home/nav/propertyService',
    group:[
      {
        id:'2-1',
        name:'社区服务',
        show: '11ba',
        menuItem:[
          {
            id:'2-1-1',
            title:'放行条',
            link:'/home/nav/propertyService/rpass',
            show: '11E0'
          },
          {
            id:'2-1-2',
            title:'警报记录',
            link:'/home/nav/propertyService/alarm',
            show: '11F0'
          },
          {
            id:'2-1-3',
            title:'在线服务',
            link:'/home/nav/propertyService/onlineService',
            show: '11G0'
          }
        ]
      },
      {
        id:'2-2',
        name:'投诉报事',
        show: '11bb',
        menuItem:[
          {
            id:'2-2-1',
            title:'住户投诉',
            link:'/home/nav/propertyService/complaint',
            show: '11H0'
          }
        ]
      },
      {
        id:'2-3',
        name:'故障报修',
        show: '11bc',
        menuItem:[
          {
            id:'2-3-1',
            title:'故障管理',
            link:'/home/nav/propertyService/fault',
            show: '11I0'
          }
        ]
      },
      {
        id:'2-4',
        name:'社区动态',
        show: '11bd',
        menuItem:[
          {
            id:'2-4-1',
            title:'动态消息',
            link:'/home/nav/propertyService/message',
            show: '11J0'
          },{
            id: '2-4-2',
            title: '举报管理',
            link: '/home/nav/propertyService/inform',
            show: '11y2'
          }
        ]
      },
      {
        id:'2-5',
        name:'消息管理',
        show: '11be',
        menuItem:[
          {
            id:'2-5-1',
            title:'社区公告',
            link:'/home/nav/propertyService/notice',
            show: '11K0'
          }
        ]
      }
    ]
  },
  {
    id:'3',
    name:'社区物联',
    show: '11b2',
    src: '/home/nav/communityIoT',
    group:[
      {
        id:'3-1',
        name:'电梯管理',
        show: '11bf',
        menuItem:[
          {
            id:'3-1-1',
            title:'电梯档案',
            link:'/home/nav/communityIoT/elevator',
            show: '11L0'
          },
          {
            id:'3-1-2',
            title:'维修记录',
            link:'/home/nav/communityIoT/record',
            show: '11M0'
          }
        ]
      },
      {
        id:'3-2',
        name:'门禁管理',
        show: '11bg',
        menuItem:[
          {
            id:'3-2-1',
            title:'门禁档案',
            link:'/home/nav/communityIoT/door',
            show: '11N0'
          }
        ]
      },
      {
        id:'3-3',
        name:'监控管理',
        show: '11bh',
        menuItem:[
          {
            id:'3-3-1',
            title:'监控档案',
            link:'/home/nav/communityIoT/monitoringD',
            show: '11O0'
          },
          {
            id:'3-3-2',
            title:'实时监控',
            link:'/home/nav/communityIoT/monitoringC',
            show: '11P0'
          }
        ]
      },
      {
        id:'3-4',
        name:'停车管理',
        show: '11bi',
        menuItem:[
          {
            id:'3-4-1',
            title:'停车设备',
            link:'/home/nav/communityIoT/parkinglotDevice',
            show: '11Q0'
          }
        ]
      },
      {
        id:'3-5',
        name:'一卡通管理',
        show: '11bj',
        menuItem:[
          {
            id:'3-5-1',
            title:'一卡通档案',
            link:'/home/nav/communityIoT/onePass',
            show: '11R0'
          },
          // {
          //   id:'3-5-2',
          //   title:'使用记录',
          //   link:'/home/nav/communityIoT/userRecord',
          //   show: 1
          // }
        ]
      }
    ]
  },
  {
    id:'4',
    name:'商圈管理',
    show: '11b3',
    src: '/home/nav/businessManage',
    group: [
      {
        id:'4-1',
        name:'周边商圈',
        show: '11bk',
        menuItem:[
          {
            id: '4-1-1',
            title:'商家管理',
            show: '11S0',
            link:'/home/nav/businessManage/merchant'
          },
          {
            id: '4-1-2',
            title:'轮播图管理',
            show: '11T0',
            link:'/home/nav/businessManage/slideShow'
          }
        ]
      },
      {
        id:'4-2',
        name:'便民服务',
        show: '11bl',
        menuItem:[
          {
            id: '4-2-1',
            title:'便民服务',
            show: '11U0',
            link:'/home/nav/businessManage/amenity'
          }
        ]
      }
    ]
  },
  {
    id:'5',
    name:'数据统计',
    show: '11b4' ,
    src: '/home/nav/summary',
    group: [
      {
        id:'5-1',
        name:'统计信息',
        show: '11bn',
        menuItem:[
          {
            id: '5-1-1',
            title:'基础信息统计',
            show: '11br',
            link:'/home/nav/summary/baseInfo'
          }
        ]
      },
      {
        id:'5-2',
        name:'警报故障',
        show: '11bo',
        menuItem:[
          {
            id: '5-2-1',
            title:'警报故障统计',
            show: '11bs',
            link:'/home/nav/summary/alarm'
          },
        ]
      },
      {
        id:'5-3',
        name:'物业缴费',
        show: '11bp',
        menuItem:[
          {
            id: '5-3-1',
            title:'物业缴费统计',
            show: '11bt',
            link:'/home/nav/summary/payment'
          },
        ]
      },
      {
        id:'5-4',
        name:'物业设备',
        show: '11bq',
        menuItem:[
          {
            id: '5-4-1',
            title:'物业设备统计',
            show: '11bu',
            link:'/home/nav/summary/equipment'
          },
        ]
      },
    ]
  }
]
export default arr;
