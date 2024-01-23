<script>
import TheNavbar from '@/components/TheNavbar.vue'

export default {
  name: 'App',
  components: { TheNavbar }
}
</script>

<template>
  <the-navbar />
  <div class="container"><router-view /></div>
</template>

<style>
@import "assets/style.css";
/* @import "~bootstrap/css/bootstrap.css"; */
</style>
