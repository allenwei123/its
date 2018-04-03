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
          <li v-for="(item,index) in items" :key="item.name" v-bind:class="{'c-nav-active':activeIndex == index}" @click="navClick(item,index)" >{{ item.name}}</li>
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
          {name: '首页', src: '/home/nav/main'},
          {name: '物业管理', src: '/home/nav/side'},
          {name: '物业服务', src: '/home/nav/propertyService'},
          {name: '社区物联', src: '/home/nav/communityIoT'},
          {name: '商圈管理', src: '/home/nav/businessManage'},
          {name: '系统管理', src: ''},
          {name: '统计分析', src: ''},
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
      let arr = ['main','side','propertyService','communityIoT'];
      let currentIndex = arr.indexOf(this.$route.path.split('/')[3])>= 0 ? arr.indexOf(this.$route.path.split('/')[3]) : 0;
      this.activeIndex = currentIndex.toString();
      if(this.activeIndex) {
        this.$store.dispatch('updatedAsideData')
          .then(res => {
            if(res.msg) {
              this.$store.dispatch('changeAsideData',this.activeIndex - 1);
            }
          })
      }
    },
    methods: {
      handleSelect(index) {
        if(index){
          this.$store.dispatch('changeAsideData',index - 1);
        }
      },
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
      navClick(item,index) {
        this.activeIndex = index;
        this.$router.push({path:item.src});
        if(index){
          this.$store.dispatch('changeAsideData',index - 1);
        }
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
