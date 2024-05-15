<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>

<template>
  <div class="col-full push-top text-center">
    <h1>Not Found!</h1>
    <router-link :to="{ name: 'Home' }">To read the threads.</router-link>
  </div>
</template>

<style scoped></style>
