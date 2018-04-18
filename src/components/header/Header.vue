<template>
  <div class="c-header">
    <div>
      <a href="" class="c-logo">智慧社区管理平台</a>
      <ul class="c-navgator">
        <li><span class="c-account"> <i class="iconfont icon-guanlikehu c-sidebar-conl">&nbsp;</i>当前社区：
          <el-dropdown @command="handleCommand" style="color: #fff; cursor: pointer">
            <span class="el-dropdown-link">
              {{ currentUser }}<i style="color: #fff" class="el-icon-arrow-down el-icon--right"></i>
            </span>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item v-for="item in communityList" :key="item.id" :command="item.id">{{item.name}}</el-dropdown-item>
             </el-dropdown-menu>
          </el-dropdown>
        </span></li>
        <!-- <li> <el-button type="success" size="mini">修改密码</el-button></li> -->
        <li><el-button type="danger" size="mini" @click="logout">退出</el-button></li>
      </ul>
      <!--nav 导航模块-->
      <div class="c-top_bar_area">
        <ul class="c-top-nav">
          <li v-for="(item,index) in items" :key="item.name" v-bind:class="{'c-nav-active':navIndex == index}" v-if="item.show" @click="navClick(item)" >{{ item.name}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
  export default {
    name: 'Header',
    data() {
      return {
        items: [
          {name: '首页', src: '/home/nav/main',id: 0,show:this.$store.getters.pms['11a0'] },
          {name: '物业管理', src: '/home/nav/side',id: 1 ,show:this.$store.getters.pms['11a1']},
          {name: '物业服务', src: '/home/nav/propertyService',id: 2 ,show:this.$store.getters.pms['11a2']},
          {name: '社区物联', src: '/home/nav/communityIoT',id: 3 ,show:this.$store.getters.pms['11a3']},
          {name: '商圈管理', src: '/home/nav/businessManage',id: 4 ,show:this.$store.getters.pms['11a4']},
//          {name: '系统管理', src: '/'},
          {name: '数据统计', src: '/home/nav/summary',id: 5 ,show:this.$store.getters.pms['11a5']},
        ],
        currentUser:'',
        pms: this.$store.getters.pms,//菜单权限
      }
    },
    computed:mapGetters(['communityList','communityId','navIndex']),
    mounted() {
      this.changeIdToName(this.communityId);
    },
    created() {},
    methods: {
      logout() {
        this.$router.push('/auth/logout');
      },
      handleCommand(command) {
        this.$store.dispatch('addCommunityId',command);
        this.changeIdToName(command);
        const loading = this.$loading({
          lock: true,
          text: '正在加载',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.$store.dispatch('updatedAsideData').then(()=> {loading.close()});
      },
      changeIdToName(id) {
        this.communityList.forEach(item => {
          if(item.id == id) this.currentUser = item.name;
        });
      },
      navClick(item) {
        this.$router.push({path:item.src});
      }
    },
  }
</script>

<style scoped lang="scss">
  $headerBg:#3988ff;
  $fontColor:#fff;
  $headerH: 50px;
  .c-header {
    position: fixed;
    top: 0;
    width: 100%;
    height: $headerH;
    border-bottom: 1px solid hsla(0, 0%, 100%, .15);
    background: $headerBg;
    .c-logo {
      float: left;
      width:168px;
      margin-top: 15px;
      margin-left: 20px;
      color:$fontColor;
    }
    .c-account {
      color: #fff;
    }
    .c-top-nav {
      margin-top:10px;
      li {
        float: left;
        line-height: 40px;
        height: 40px;
        padding: 0 11px;
        color:#ffffff;
        cursor: pointer;
        &.c-nav-active {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: #d7e7ff;
          color:#4f91f4;
        }
      }
    }
    .c-navgator {
      position: absolute;
      right: 0px;
      z-index: 100;
      font-size: 14px;
      li {
        float: left;
        height: $headerH;
        line-height:$headerH;
        color: $fontColor;
        margin-right:7px;
      }
    }
    .c-top_bar_area {
      float: left;
      color: #1a6f4d;
      height: $headerH;
      padding: 0 12px;
      cursor: pointer;
    }
    .c-sidebar-conl {
      color:white;
    }
  }
</style>
