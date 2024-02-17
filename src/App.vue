<script>
import TheNavbar from '@/components/TheNavbar.vue'
import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: { TheNavbar },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
  }
}
</script>

<template>
  <TheNavbar />
  <router-view />
</template>

<style>
@import "assets/style.css";
/* @import "~bootstrap/css/bootstrap.css"; */
</style>
