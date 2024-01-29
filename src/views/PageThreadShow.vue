<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'

export default {
  components: { PostList, PostEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.$store.state.posts.filter(({ threadId }) => threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.$store.dispatch('createPost', post)
    }
  }
}
</script>

<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <!-- event and tag props are deprecated. Use scoped slots instead. -->
      <router-link
        :to="{ name: 'ThreadEdit', params: { id } }"
        v-slot="{ navigate }"
        class="btn-green btn-small"
        ><button @click="navigate" role="link">Edit Thread</button></router-link
      >
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">{{ thread.author.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} repl{{
          thread.repliesCount ? "ies" : "y"
        }}
        by {{ thread.contributorsCount }} contributor{{
          thread.contributorsCount ? "s" : ""
        }}</span
      >
    </p>
    <PostList :posts="threadPosts" />
    <PostEditor @save="addPost" />
  </div>
</template>

<style scoped></style>
