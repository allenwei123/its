<template>
  <div class="c-header">
    <div>
      <ul class="c-navgator">
        <li>
          <img v-if="this.$store.getters.headImg" class="c-user-image" :src="uri">
          <img v-else class="c-user-image" src="@/assets/user.png">
          <el-dropdown @command="handleCommand" style="color: #333333; cursor: pointer; margin-left:5px;">
            <p class="el-dropdown-link">{{ currentUser }}</p>
             <el-dropdown-menu slot="dropdown">
               <el-dropdown-item @click="logout">退出</el-dropdown-item>
             </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getUri } from '@/utils/oss';

  export default {
    name: 'Header',
    data() {
      return {
        currentUser: JSON.parse(localStorage.getItem('userInfo')).name  || '未命名',
        uri: '',
        nickname: ''
      }
    },
    mounted() {
      this.gotHeadImg();
    },
    created() {},
    methods: {
      logout() {
        this.$router.push('/auth/logout');
      },
      handleCommand(command) {
        this.$router.push('/auth/logout');
      },
      navClick(item) {
        this.$router.push({path:item.src});
      },
      gotHeadImg(){
        if(this.$store.getters.headImg) {
          getUri(this.$store.getters.headImg,(uri)=> {
              this.uri = uri;
          });
        }
      }
    },
  }
</script>

<style scoped lang="scss">
  $headerBg:#fff;
  $fontColor:#000;
  $headerH: 50px;
  .c-header {
    position: fixed;
    top: 0;
    width: calc(100% - 150px);
    height: $headerH;
    border-bottom: 1px solid #000;
    background: $headerBg;
    .c-user-image {
      width:24px; 
      height:24px; 
      border-radius:100%;
      vertical-align: middle;
      }
    .c-navgator {
      position: absolute;
      right: 20px;
      z-index: 100;
      font-size: 14px;
      li {
        float: left;
        height: $headerH;
        line-height:$headerH;
        color: $fontColor;
        margin-right:7px;
      }
    }
  }
</style>
