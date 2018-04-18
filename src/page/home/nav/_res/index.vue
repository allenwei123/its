<template>
  <div class="content">

    <el-container class="c-container">

      <el-aside class="c-aside" style="background-color:#ffffff " width="auto">

        <div class="c-settingMenu" @click="cn()">三</div>
<!-- bg 4a5064   -->
        <el-menu width="200px" v-if="asideData.length" :collapse="isCollapse" background-color="#ffffff" text-color="#000" :default-active="$route.path" active-text-color="#409EFF">
          <el-submenu  v-for="(itemNemu,index) in asideData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="iconfont icon-wuyeguanli">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
            <el-menu-item class="test" v-for="(itemGroup) in itemNemu.menuItem" v-bind:key="itemGroup.link" :index="itemGroup.link" @click="alink(itemGroup)">{{ itemGroup.title  }}</el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>

      <router-view/>


    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

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
    updated() {},
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
    background-color: #efefef;
    height:calc(100vh - 50px);
  }
  .el-aside {
    color: #333;
  }
  .c-settingMenu {
    height:41px;
    background-color: #ffffff;
    color:#000;
    line-height: 35px;
    text-align: center;
    cursor: pointer;
    margin-right: 1px;
    border-bottom: .2px solid #efefef;
  }
  .c-aside{
    /*width:220px !important;*/
  }
  .c-aside-title {
    color:#000;
    font-weight: 800;
  }
</style>
