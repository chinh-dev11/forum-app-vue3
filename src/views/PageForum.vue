<script>
import ThreadList from '@/components/ThreadList.vue'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import { findById } from '@/helpers'

export default {
  components: { ThreadList },
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums, this.forumId)
    },
    forumThreads () {
      return this.forum.threads.map(threadId => this.$store.getters.thread(threadId))
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads', 'fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.forumId })
    const threads = await this.fetchThreads({ ids: forum.threads })
    const userIds = [...new Set(threads.map(({ userId }) => userId))]
    await this.fetchUsers({ ids: userIds })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
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
  </div>
</template>

<style scoped></style>
