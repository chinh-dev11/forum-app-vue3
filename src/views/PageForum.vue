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
  data () {
    return {
      page: 1,
      perPage: 10
    }
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums.items, this.forumId)
    },
    forumThreads () {
      if (!this.forum) return []

      return this.$store.state.threads.items
        .filter((thread) => thread.forumId === this.forum.id)
        .map((thread) => this.$store.getters['threads/thread'](thread.id))
    },
    forumThreadsCount () {
      return this.forum.threads.length
    },
    totalPage () {
      if (!this.forumThreadsCount) return 0

      return Math.ceil(this.forumThreadsCount / this.perPage)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreadsByPage']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.forumId })
    const threads = await this.fetchThreadsByPage({
      ids: forum.threads,
      page: this.page,
      perPage: this.perPage
    })
    const userIds = [...new Set(threads.map(({ userId }) => userId))]
    await this.fetchUsers({ ids: userIds })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  },
  watch: {
    async page (page) {
      const threads = await this.fetchThreadsByPage({
        ids: this.forum.threads,
        page,
        perPage: this.perPage
      })
      const userIds = [...new Set(threads.map(({ userId }) => userId))]
      await this.fetchUsers({ ids: userIds })
    }
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
    <v-pagination v-model="page" :pages="totalPage" active-color="#57AD8D" />
  </div>
</template>

<style scoped></style>
