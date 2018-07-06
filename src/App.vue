<template>
  <div class="home_container">
    <router-view/>
  </div>
</template>

<script>
import './utils/filter';

export default {
  name: 'App',
  created() {}
}
</script>

<style  lang="scss">
@import './style/common.scss';
@import './style/cover-elementui.scss';
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-width: 1000px;
}
</style>
