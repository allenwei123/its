<template>
  <div class="home_container">
    <Header></Header>
    <el-container class="c-container">
        <Mynav> </Mynav>
        <router-view />
    </el-container>
    
  </div>
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
        height: calc(100vh - 50px);
        margin-top: 50px;
        position: relative;
    }
</style>
