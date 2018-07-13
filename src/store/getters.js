
export default {
    token: (state) => state.permission.userInfo ? state.permission.userInfo.token : null,
    uid: (state) => state.permission.userInfo ? state.permission.userInfo.id : null,
    pms: state => state.data.permissionData,
    userInfo: (state) => state.permission.userInfo.id,
    showAside: state => state.tool.isShow ,//判断侧边栏
    asideData: state => state.data.asideData || [],//侧边栏数据
    navIndex: state => state.data.navIndex,//当前头部导航的下标
    headImg: (state) => state.permission.userInfo.headImg,  //登录用户的头像
    nickname: (state) => state.permission.userInfo.nickName || ''
  };