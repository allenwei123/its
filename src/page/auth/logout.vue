<template>
  <div class="c-logout-container"></div>
</template>

<script>
  import { Loading } from 'element-ui';

  export default {
    name: 'logout',
    data() {
      return {
        loading: true
      }
    },
    created() {
      let loadingInstance = Loading.service({
        text: '正在退出'
      });
      this.$xttp.get('user/signOut').then((res) => {
        // this.$store.dispatch('changeToken', null);
        // loadingInstance.close();
        if(res.success){
          this.$router.push('/auth/login');
        }
        
      }).catch(() => {
        loadingInstance.close();
      });
    }
  }
</script>
