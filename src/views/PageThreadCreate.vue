<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { ThreadEditor },
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
    }
  },
  methods: {
    ...mapActions(['createThread', 'fetchForum']),
    async save ({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id
      })

      this.$router.push({ name: 'Thread', params: { threadId: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { forumId: this.forum.id } })
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <h1>
        Create new thread in <i>{{ forum.name }}</i>
      </h1>
      <ThreadEditor @save="save" @cancel="cancel" />
    </div>
  </div>
</template>

<style scoped></style>
