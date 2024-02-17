<script>
import TheNavbar from '@/components/TheNavbar.vue'
import { mapActions } from 'vuex'
import AppSpinner from './components/AppSpinner.vue'

export default {
  name: 'App',
  components: { TheNavbar, AppSpinner },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()

    this.$router.beforeEach(() => {
      this.showPage = false
    })
  }
}
</script>

<template>
  <TheNavbar />
  <router-view v-show="showPage" @ready="showPage = true" />
  <AppSpinner v-show="!showPage" />
</template>

<style>
@import "@/assets/style.css";
/* @import "~bootstrap/css/bootstrap.css"; */
</style>
