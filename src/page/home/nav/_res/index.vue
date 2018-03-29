<template>
  <div class="content">

    <el-container class="c-container">

      <el-aside class="c-aside" style="background-color: rgb(238, 241, 246)" width="auto">

        <div class="c-settingMenu" @click="cn()">三</div>

        <el-menu width="200px" v-if="asideData.length" :collapse="isCollapse" background-color="#4a5064" text-color="#fff" :default-active="$route.path" active-text-color="#409EFF">
          <el-submenu  v-for="(itemNemu,index) in asideData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="iconfont icon-wuyeguanli">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
            <el-menu-item class="test" v-for="(itemGroup) in itemNemu.menuItem" v-bind:key="itemGroup.link" v-if="itemGroup.show == '1'" :index="itemGroup.link" @click="alink(itemGroup)">{{ itemGroup.title  }}</el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>
      <router-view/>

    </el-container>
  </div>
</template>

<script>
import obj1 from '../../../../mock/mok.json'
import { mapGetters } from "vuex"
import aside from '@/mock/menuList'

  export default {
    name: 'side',
    data() {
      return {
        indexFlag:null,
        index1:'1-2',
        isCollapse:false
      }
    },
    computed: mapGetters(["asideData"]),
    components:{
    },
    mounted() {},
    updated() {
    },
    methods:{
      alink(item) {
        this.$router.push({path:item.link})
      },
      cn() {
          this.isCollapse = !this.isCollapse;
          this.$store.dispatch('change_aside',!this.isCollapse);
      },
    }
  }
</script>

<style scoped lang="scss">
  .content {
    margin-top:50px;
  }
  .c-container {
    height:calc(100vh - 50px);
  }
  el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-aside {
    color: #333;
  }
  .dh {
    color:red;
  }
  .c-settingMenu {
    height:41px;
    background-color: #4a5064;
    color:#aeb9c2;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    margin-right: 1px;
    border-bottom: .2px solid #312525;
  }
  .c-aside{
    /*width:220px !important;*/
  }
  .c-aside-title {
    color:#909399;
  }
</style>
