<script>
import TheNavbar from '@/components/TheNavbar.vue'
export default {
  name: 'App',
  components: { TheNavbar }
}
</script>

<template>
  <the-navbar />
  <div class="containre"><router-view /></div>
</template>

<style>
@import "assets/style.css";
/* @import "~bootstrap/css/bootstrap.css"; */
</style>
