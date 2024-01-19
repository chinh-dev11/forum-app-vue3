<script>
import dataSource from '@/data.json'

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      threads: dataSource.threads
    }
  },
  computed: {
    thread () {
      return this.threads.find((t) => t.id === this.id)
    }
  }
}
</script>

<template>
  <div>{{ thread.title }}</div>
</template>

<style lang="scss" scoped></style>
