<template>
  <div class="c-header">
    <div>
      <a href="" class="c-logo" @click="change">智慧社区管理平台</a>
      <ul class="c-navgator">
        <li><span class="c-account"> <i class="iconfont icon-guanlikehu c-sidebar-conl">&nbsp;</i>当前账号：{{ user }}</span></li>
        <li> <el-button type="success" size="mini">修改密码</el-button></li>
        <li><el-button type="primary" size="mini" @click="logout">退出</el-button></li>
      </ul>
      <!--nav 导航模块-->
      <div class="c-top_bar_area">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">首页</el-menu-item>
          <el-menu-item index="2">物业管理</el-menu-item>
          <el-menu-item index="3">物业服务</el-menu-item>
          <el-menu-item index="4" >社区物联</el-menu-item>
          <el-menu-item index="4" >商圈管理</el-menu-item>
          <el-menu-item index="5" >系统管理</el-menu-item>
          <el-menu-item index="6" >统计分析</el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'Header',
    data() {
      return {
        items: [
          {n: '控制台', src: '/about'},
          {n: '文档', src: '/docs'},
          {n: '技能', src: 'http://aliyun.com'},
        ],
        activeIndex: '1',
        activeIndex2: '1',
        user:'admin'
      }
    },
    computed:mapState([
      'showContent'
    ]),
    methods: {
      ...mapActions([
        'ChangeShowContent'
      ]),
      change() {
        this.ChangeShowContent(!this.showContent);
      },
      handleSelect(index) {
          console.log(index)
      },
      logout() {
        this.$router.push('/auth/logout');
      }
    }
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
