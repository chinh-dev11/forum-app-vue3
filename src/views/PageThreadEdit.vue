<script>
import ThreadEditor from '@/components/ThreadEditor.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { ThreadEditor },
  mixins: [asyncDataStatus],
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  computed: {
    thread () {
      return findById(this.$store.state.threads, this.threadId)
    },
    text () {
      // the 1st post, at index [0], is created when the thread was first created. Hence using its id to find the post's text.
      const post = findById(this.$store.state.posts, this.thread.posts[0])

      return post ? post.text : ''
    }
  },
  methods: {
    ...mapActions(['updateThread', 'fetchThread', 'fetchPost']),
    async save ({ title, text }) {
      const thread = await this.updateThread({
        title,
        text,
        id: this.threadId
      })

      if (!thread.error) {
        this.$router.push({
          name: 'Thread',
          params: { threadId: thread.id }
        })
      }

      // TODO: manage error
      console.error(thread.error)
    },
    cancel () {
      this.$router.push({
        name: 'Thread',
        params: { threadId: this.thread.id }
      })
    }
  },
  beforeRouteLeave (to, from) {
    // TODO: cancel must not redirect to Forum page when there's change in the form. But after cancel the confirm window, click on cancel again redirects to Thread page (formIsDirty is no longer true???)
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        'Are you sure you want to leave? Unsaved changes will be lost?'
      )
      if (!confirmed) return false
    }
  },
  async created () {
    const thread = await this.fetchThread({ id: this.threadId })
    await this.fetchPost({ id: thread.posts[0] })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <h1>Editing {{ thread.title }}</h1>
      <ThreadEditor
        :title="thread.title"
        :text="text"
        @save="save"
        @cancel="cancel"
        @dirty="formIsDirty = true"
        @clean="formIsDirty = false"
      />
    </div>
  </div>
</template>

<style scoped></style>
