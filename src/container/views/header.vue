<template>
  <div class="c-header">
    <div>
      <a href="" class="c-logo">后台管理系统</a>
      <ul class="c-navgator">
        <li><span class="c-account"> <i class="iconfont icon-xiazai20 c-sidebar-conl">&nbsp;</i>
          <el-dropdown @command="handleCommand" style="color: #fff; cursor: pointer">
            <span class="el-dropdown-link">{{currentUser}}</span>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item @click="logout">退出</el-dropdown-item>
             </el-dropdown-menu>
          </el-dropdown>
        </span></li>
        <li><img class="c-user-image" src="../../assets/headImg.png" style="width:45px; height:45px; border-radius:100%"></li>
        <li>{{nickname}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import aside from '@/mock/menuList';
import { getUri } from '@/utils/oss';

  export default {
    name: 'Header',
    data() {
     let arr2 =  aside.map(item => {
          return {
            src:item.src,
            name: item.name,
            show: 1
          }
      });
      return {
        items: [
          ...arr2
        ],
        currentUser:'',
        pms: this.$store.getters.pms,//菜单权限
        uri: '',
        nickname: ''
      }
    },
    computed:mapGetters(['communityList','communityId','navIndex','headImg']),
    mounted() {
      
    },
    created() {},
    methods: {
      logout() {
        this.$router.push('/auth/logout');
      },
      handleCommand(command) {
        this.$router.push('/auth/logout');
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
