<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'

export default {
  components: { ThreadEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.id)
    },
    text () {
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post's text.
      const post = findById(this.$store.state.posts, this.thread.posts[0])

      return post ? post.text : ''
    }
  },
  async created () {
    const thread = await this.$store.dispatch('fetchThread', { id: this.id })
    this.$store.dispatch('fetchPost', { id: thread.posts[0] })
  },
  methods: {
    async save ({ title, text }) {
      const thread = await this.$store.dispatch('updateThread', {
        title,
        text,
        id: this.id
      })

      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'ThreadShow', params: { id: this.thread.id } })
    }
  }
}
</script>

<template>
  <div v-if="thread && text" class="col-full push-top">
    <h1>Editing {{ thread.title }}</h1>
    <ThreadEditor
      :title="thread.title"
      :text="text"
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped></style>
