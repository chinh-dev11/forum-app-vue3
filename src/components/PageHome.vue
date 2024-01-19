<script>
import ThreadList from './ThreadList.vue'
import dataSource from '@/data.json'

export default {
  components: { ThreadList },
  data () {
    return {
      threads: dataSource.threads
    }
  }
}
</script>

<template>
    <h1>Welcome to the Forum</h1>
    <ThreadList :threads="threads"/>
</template>

<style scoped></style>
