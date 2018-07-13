<template>
  <div class="content">
      <el-aside class="c-aside"  style="background-color:#19233c;max-width: 150px;overflow-y: scroll;overflow-x: hidden;height: 100%" width="auto">

        <div class="c-settingMenu" >比亦特</div>
        <el-menu style="min-width: 150px;" v-if="asideData.length" :default-active="matchUrl($route.path)" :collapse="isCollapse" background-color="#19233c" text-color="#fff" active-text-color="#409EFF">
         
         <div v-for="(itemNemu,index) in asideData" v-bind:key="index">
            <el-submenu  :index="itemNemu.id" v-bind:key="index" v-if="itemNemu.menuItem">
              <template slot="title"><i class="iconfont icon-wuyeguanli">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
              <el-menu-item class="test" v-for="(itemGroup) in itemNemu.menuItem" v-bind:key="itemGroup.link" :index="itemGroup.link" @click="alink(itemGroup)">{{ itemGroup.title  }}</el-menu-item>

            </el-submenu>

            <el-menu-item :index="itemNemu.link" v-if="!itemNemu.menuItem" @click="alink(itemNemu)">
              <span slot="title">{{ itemNemu.name }}</span>
            </el-menu-item>

          </div>

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
  @import '../../style/var.scss';

  .content {
    position: relative;
  }
  .el-aside {
    color: #fff;
  }
  .c-settingMenu {
    height:41px;
    background-color: #19233c;
    color: #fff;
    line-height: $headerHeight;
    text-align: center;
    cursor: pointer;
    margin-right: 1px;
  }
  .c-aside-title {
    color:#fff;
    font-weight: 800;
  }
</style>
