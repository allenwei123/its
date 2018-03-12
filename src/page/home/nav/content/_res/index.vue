<template>
  <div class="content">
    123123
      <iframe src="test.html" id="show-iframe" frameborder="0"></iframe>
  </div>
</template>

<script>

  export default {
    name: 'Content',
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        as:'affjin',
      };
      return {
        
      }
    },
    components:{
    },
    created() {
    },
    mounted:() => {
      const oIframe = document.getElementById('show-iframe');
      // const deviceWidth = document.documentElement.clientWidth/2;
      // const deviceHeight = document.documentElement.clientHeight/2;
      oIframe.style.width = '100%';
      oIframe.style.height = '100%';
    },
    methods:{
    }
  }
</script>

<style scoped lang="scss">
  .content {
    width: 100%;
  }
</style>
