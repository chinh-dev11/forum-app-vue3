<script>
import ThreadList from '@/components/ThreadList.vue'
import { mapActions } from 'vuex'

export default {
  components: { ThreadList },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      forum: {},
      forumThreads: []
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers'])
  },
  async created () {
    this.forum = await this.fetchForum({ id: this.forumId })
    const threads = await this.fetchThreads({ ids: this.forum.threads })
    this.forumThreads = threads.map(({ id }) => this.$store.getters.thread(id))
    const userIds = [...new Set(threads.map(({ userId }) => userId))]
    await this.fetchUsers({ ids: userIds })
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
      <router-link
        :to="{ name: 'ThreadCreate', params: { forumId: forum.id } }"
        class="btn-green btn-small"
        >Start a thread
      </router-link>
    </div>
  </div>
  <div class="col-full">
    <div class="category-item">
      <div class="forum-list"></div>
    </div>
  </div>
  <ThreadList :threads="forumThreads" />
</template>

<style scoped></style>
