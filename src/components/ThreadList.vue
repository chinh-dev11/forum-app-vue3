<script>
import ThreadListItem from './ThreadListItem.vue'

export default {
  components: { ThreadListItem },
  props: {
    threads: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <ThreadListItem
        v-for="thread in threads"
        :key="thread.id"
        :thread="thread"
      />
    </div>
  </div>
</template>

<style scoped>
.thread-list {
  padding: 0;
  background-color: white;
}
</style>
