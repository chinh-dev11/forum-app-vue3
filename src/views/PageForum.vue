<script>
import ThreadList from '@/components/ThreadList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

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
      return findById(this.$store.state.forums, this.id) || {}
    },
    forumThreads () {
      return this.forum.threads?.map((threadId) =>
        this.$store.getters.thread(threadId)
      )
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'fetchThreads'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    this.fetchThreads({ ids: forum.threads })
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
        v-if="forum.id"
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
