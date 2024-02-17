<script>
import TheNavbar from '@/components/TheNavbar.vue'
import { mapActions } from 'vuex'
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
    ...mapActions(['fetchAuthUser']),
    onPageReady () {
      NProgress.done()
      this.showPage = true
    }
  },
  created () {
    this.fetchAuthUser()

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
  <TheNavbar />
  <router-view v-show="showPage" @ready="onPageReady" />
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
