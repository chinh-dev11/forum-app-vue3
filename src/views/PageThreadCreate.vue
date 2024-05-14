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
  data () {
    return {
      formIsDirty: false
    }
  },
  computed: {
    forum () {
      return findById(this.$store.state.forums.items, this.forumId)
    }
  },
  methods: {
    ...mapActions('threads', ['createThread']),
    ...mapActions('forums', ['fetchForum']),
    async save ({ title, text }) {
      const thread = await this.createThread({
        title,
        text,
        forumId: this.forum.id
      })

      if (!thread.error) {
        this.$router.push({ name: 'Thread', params: { threadId: thread.id } })
      }

      // TODO: manage error
      console.error(thread.error)
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { forumId: this.forum.id } })
    }
  },
  beforeRouteLeave (to, from) {
    // TODO: cancel must not redirect to Forum page when there's change in the form. But after cancel the confirm window, click on cancel again redirects to Forum page (formIsDirty is no longer true???)
    if (this.formIsDirty) {
      const confirmed = window.confirm(
        'Are you sure you want to leave? Unsaved changes will be lost!'
      )
      if (!confirmed) return false
    }
  },
  async created () {
    await this.fetchForum({ id: this.forumId })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready">
    <div class="col-full push-top">
      <h1>
        Create new thread in <i>{{ forum.name }}</i>
      </h1>
      <ThreadEditor
        @save="save"
        @cancel="cancel"
        @dirty="formIsDirty = true"
        @clean="formIsDirty = false"
      />
    </div>
  </div>
</template>

<style scoped></style>
