<script>
import ThreadList from '@/components/ThreadList.vue'

export default {
  components: { ThreadList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(({ id }) => id === this.id)
    },
    threads () {
      return this.$store.state.threads.filter(
        (t) => t.forumId === this.forum.id
      )
    }
  }
}
</script>

<template>
  <div class="col-full push-top">
    <div class="forum-header">
      <div class="forum-details">
        <h1>{{ forum.name }}</h1>
        <p class="text-lead">{{ forum.description }}</p>
      </div>
      <a href="#" class="btn-green btn-small">Start a thread</a>
    </div>
  </div>
  <div class="col-full">
    <div class="category-item">
      <div class="forum-list"></div>
    </div>
  </div>
  <ThreadList :threads="threads" />
</template>

<style lang="scss" scoped></style>
