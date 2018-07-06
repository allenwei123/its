<template>
  <div class="content">
      <el-aside class="c-aside"  style="background-color:#ffffff;max-width: 150px;overflow-y: scroll;overflow-x: hidden;height: 100%" width="auto">

        <!-- <div class="c-settingMenu" @click="cn()">三</div> -->
        <el-menu style="min-width: 150px;" v-if="asideData.length" :default-active="matchUrl($route.path)" :collapse="isCollapse" background-color="#ffffff" text-color="#000" active-text-color="#409EFF">
          <el-submenu  v-for="(itemNemu,index) in asideData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="iconfont icon-wuyeguanli">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
            <el-menu-item class="test" v-for="(itemGroup) in itemNemu.menuItem" v-bind:key="itemGroup.link" :index="itemGroup.link" @click="alink(itemGroup)">{{ itemGroup.title  }}</el-menu-item>

          </el-submenu>
        </el-menu>

      </el-aside>
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
    mounted() {
      
    },
    methods:{
      alink(item) {
        this.$router.push({path:item.link})
      },
      matchUrl(path) {
        if(path.split('/').length > 5) {
          return path.substring(0,path.lastIndexOf('/'))
        }
        return path;
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
    position: relative;
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
  .c-aside-title {
    color:#000;
    font-weight: 800;
  }
</style>
