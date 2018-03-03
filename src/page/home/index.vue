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
  import Header from '../../components/header/Header'
  import Content from './nav/index.vue'
  import arr from '../../mock/menuList'

  export default {
    data() {
      return {
        data:arr
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
        console.log(JSON.stringify(arr))
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
