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
        <li> <el-button type="success" size="mini">修改密码</el-button></li>
        <li><el-button type="primary" size="mini" @click="logout">退出</el-button></li>
      </ul>
      <!--nav 导航模块-->
      <div class="c-top_bar_area">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="6" >首页</el-menu-item>
          <el-menu-item index="0" ><router-link to="/home/nav/side/communityFile">物业管理</router-link></el-menu-item>
          <el-menu-item index="1" ><router-link to="/home/nav/propertyService/rpass">物业服务</router-link></el-menu-item>
          <el-menu-item index="2" ><router-link to="/home/nav/communityIoT">社区物联</router-link></el-menu-item>
          <el-menu-item index="3" >商圈管理</el-menu-item>
          <el-menu-item index="4" >系统管理</el-menu-item>
          <el-menu-item index="5" >统计分析</el-menu-item>
        </el-menu>
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
          {n: '控制台', src: '/about'},
          {n: '文档', src: '/docs'},
          {n: '技能', src: 'http://aliyun.com'},
        ],
        activeIndex: '0',
        currentUser:'',
      }
    },
    computed:mapGetters(['communityList','communityId']),
    mounted() {
      this.changeIdToName(this.communityId);
    },
    created() {
      let arr = ['side','propertyService','communityIoT'];
      let currentIndex = arr.indexOf(this.$route.path.split('/')[3])>= 0 ? arr.indexOf(this.$route.path.split('/')[3]) : 0;
      this.$store.dispatch('changeAsideData',currentIndex);
      this.activeIndex = currentIndex.toString();
    },
    methods: {
      handleSelect(index) {
        if(index !== '6'){
          this.$store.dispatch('changeAsideData',index);
        }
      },
      logout() {
        this.$router.push('/auth/logout');
      },
      handleCommand(command) {
        this.$store.dispatch('addCommunityId',command);
        this.changeIdToName(command);
        window.location.reload();
      },
      changeIdToName(id) {
        this.communityList.forEach(item => {
          if(item.id == id) this.currentUser = item.name;
        });
      }
    },
  }
</script>

<style scoped lang="scss">
  $headerBg:#23262b;
  $fontColor:#fff;
  $headerH: 40px;
  .c-header {
    position: fixed;
    top: 0;
    width: 100%;
    height: $headerH;
    border-bottom: 1px solid hsla(0, 0%, 100%, .15);
    background: $headerBg;
    .c-logo {
      float: left;
      width:148px;
      margin-top: 10px;
      margin-left: 20px;
      color:$fontColor;
    }
    .c-account {
      color: #fff;
    }
    .c-navgator {
      float: right;
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
