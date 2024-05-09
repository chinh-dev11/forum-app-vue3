<script>
import TheNavbar from '@/components/TheNavbar.vue'
import AppSpinner from './components/AppSpinner.vue'
import NProgress from 'nprogress'

export default {
  name: 'App',
  components: { TheNavbar, AppSpinner },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    onPageReady () {
      NProgress.done()
      this.showPage = true
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })

    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<template>
  <TheNavbar @ready="onPageReady" />
  <!-- by adding the 'key' attribut with unique value (the route path) to force Vue Router to destroy component thus trigger the lifecycle hooks. -->
  <router-view v-show="showPage" @ready="onPageReady" :key="`${$route.path}${JSON.stringify($route.query)}`" />
  <AppSpinner v-show="!showPage" />
</template>

<style>
@import "@/assets/style.css";
/* @import "~bootstrap/css/bootstrap.css"; */
@import "~nprogress/nprogress.css";
#nprogress .bar{
  background-color: #57adbd !important;
}
</style>
