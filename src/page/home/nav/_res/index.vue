<template>
  <div class="content">

    <el-container class="c-container">

      <el-aside class="c-aside" style="background-color: rgb(238, 241, 246)" width="auto">

        <div class="c-settingMenu" @click="cn()">三</div>

        <el-menu :collapse="isCollapse" background-color="#4a5064" text-color="#fff" active-text-color="#409EFF" default-active="5a990a513d6af1cbc8da299e">
          <el-submenu  v-for="(itemNemu,index) in asideData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="iconfont icon-wuyeguanli">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
            <el-menu-item class="test" v-for="(itemGroup,index) in itemNemu.children" v-bind:key="index" :index="itemGroup.id" @click="alink(itemGroup)">{{ itemGroup.name  }}</el-menu-item>

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

  export default {
    name: 'side',
    data() {
      return {
        index:'1-1',
        index1:'1-2',
        arrData: obj1.data[0].children,
        isCollapse:false
      }
    },
    computed: mapGetters(["asideData"]),
    components:{
    },
    created() {

    },
    mounted:() => {
    },
    watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'test1'
  },
    methods:{
      alink(item) {
        this.$router.push({path:item.url,query:{page:1}})
      },
      cn() {
          this.isCollapse = !this.isCollapse;
          this.$store.dispatch('change_aside',!this.isCollapse);
      },
      test1() {
        let arr = ['side','propertyService','communityIoT'];
        let currentIndex = arr.indexOf(this.$route.path.split('/')[3]);
        this.arrData = obj1.data[currentIndex].children;
      }
    }
  }
</script>

<style scoped lang="scss">
  .content {
    margin-top:40px;
  }
  .c-container {
    height:calc(100vh - 40px);
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
