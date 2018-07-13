<template>
  <el-container class="home_container">
    <Mynav> </Mynav>
    <el-container class="c-container">
        <Header></Header>
        <router-view />
    </el-container>
    
  </el-container>
</template>

<script>
  import Header from './header'
  import Mynav from './nav'

  export default {
    name: 'MyContent',
    data() {
      return {
        navDetailData:[ ]
      }
    },
    methods: {
    },
    components: {
      Header,
      Mynav
    },
    created() {
    }
  }
</script>

<style lang="scss" scoped>
    .c-container {
        background-color: #efefef;
        height: 100vh;
        position: relative;
    }
</style>
