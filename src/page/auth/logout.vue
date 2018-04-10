<template>
  <div class="c-logout-container"></div>
</template>

<script>
  import { Loading } from 'element-ui';

  export default {
    name: 'logout',
    loading: false,
    data() {
      return {
        loading: true
      }
    },
    created() {
      // let loadingInstance = Loading.service({
      //   text: '正在退出'
      // });
     let loading = Loading.service({fullscreen: true, text: '拼命加载中....'});
      // this.loading = true;
      this.$xttp.get('user/signOut').then((res) => {
        // this.$store.dispatch('changeToken', null);
        // loadingInstance.close();
        if(res.success){
          loading.close();
          // this.loading = false;
          this.$router.push('/auth/login');
        }
        
      }).catch(() => {
        loadingInstance.close();
      });
    }
  }
</script>
