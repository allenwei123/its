<template>
  <div>
    <div class="c-return" >
      <a @click="go"><i class="el-icon-arrow-left"></i>回到登陆页</a>
    </div>
    <div class="c-error">
      您访问的页面，我暂时找不到...
    </div>
  </div>
</template>

<script>
  export default {
      name: 'error',
      data(){
          return {

          }
      },
      methods:{
        go(){
          this.$store.dispatch('addCommunityId',null);
          this.$store.dispatch('clearPermission');
          this.$router.push('/auth/login');
        }
      }
  }
</script>

<style scoped>
  .c-error {
    width:100%;
    height:300px;
    line-height: 300px;
    text-align: center;
    font-size: 40px;
    color: skyblue;
  }
  .c-return {
    height: 30px;
    line-height: 30px;
    margin-left: 20px;
    font-weight: 800;
  }

</style>
