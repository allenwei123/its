<template>
  <div class="home_container">
    <Header></Header>
    <transition name="fade">
      <router-view/>
    </transition>
  </div>
</template>


<script>
  import { mapState } from 'vuex'
  import Header from '../../../components/header/Header'
  import Content from './../nav/_res/index.vue'

  export default {
    data() {
      return {
      }
    },
    name: 'home',
    methods: {
    },
    components: {
      Header,
      Content
    },
    created() {
        if (!this.$store.getters.token) {
          this.$router.push('/auth/login');
        }
    }
  }
</script>

<style lang="scss" scoped>
  .fade-enter-active, .fade-enter-active {
    transition: all 2s ease
  }
  .fade-enter, .fade-leave-active {
    transform:translateX(-100%);
  }
  .fei-enter-active, .fei-leave-active {
    transition: all 0.5s ease;
  }
  .fei-enter{
    transform:rotate(-90deg);
  }
</style>
