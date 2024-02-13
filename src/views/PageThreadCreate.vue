<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

export default {
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums, this.forumId) || {}
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
  created () {
    this.fetchForum({ id: this.forumId })
  }
}
</script>

<template>
  <div class="col-full push-top">
    <h1>
      Create new thread in <i>{{ forum.name }}</i>
    </h1>
    <ThreadEditor @save="save" @cancel="cancel" />
  </div>
</template>

<style scoped></style>
