<script>
import ThreadEditor from '@/components/ThreadEditor.vue'

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
      return this.$store.state.threads.find(({ id }) => id === this.id)
    },
    text () {
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post's text.
      return this.$store.state.posts.find(
        ({ id }) => id === this.thread.posts[0]
      ).text
    }
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
  <div class="col-full push-top">
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
