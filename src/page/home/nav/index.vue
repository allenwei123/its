<template>
  <div class="content">

    <el-container class="c-container">

      <el-aside class="c-aside" style="background-color: rgb(238, 241, 246)" width="auto">

        <div class="c-settingMenu" @click="cn()">三</div>

        <el-menu :collapse="isCollapse" background-color="#4a5064" text-color="#fff" active-text-color="#409EFF" default-active="5a990a513d6af1cbc8da299e">
          <el-submenu  v-for="(itemNemu,index) in arrData" :index="itemNemu.id" v-bind:key="index">
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
//  import Con1 from '../../../components/Con1.vue'
import arr from '../../../mock/menuList'
import obj1 from '../../../mock/mok.json'
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
    components:{
//      Con1,
    },
    created() {
        console.log(obj1.data[0].children[0].id)
    },
    mounted:() => {
    },
    methods:{
      alink(item) {
        this.$router.push(item.url)
      },
      cn() {
          this.isCollapse = !this.isCollapse;
      }
    }
  }
</script>

<style scoped lang="scss">
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
