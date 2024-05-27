<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: 'large'
    }
  }
}
</script>

<template>
  <img
    :src="src || '/user-placeholder.png'"
    :alt="`${alt} profile picture`"
    :class="`avatar-${size}`"
  />
</template>

<style scoped>
img {
  object-fit: cover;
}
</style>
