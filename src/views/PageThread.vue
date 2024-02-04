<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { mapActions } from 'vuex'
import { flatFilterValues } from '@/helpers'

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
      return this.$store.state.posts.filter(({ threadId }) => threadId === this.thread.id)
    }
  },
  methods: {
    ...mapActions(['createPost', 'fetchThread', 'fetchPosts', 'fetchUsers']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.thread.id
      }

      this.createPost({ post })
    }
  },
  // using created to ensure the reactivity of the computed props, instead of beforeCreate hook.
  async created () {
    // fetch thread
    const thread = await this.fetchThread({ id: this.id })

    // fetch posts
    const posts = await this.fetchPosts({ ids: thread.posts })

    // fetch the posts associated users and the thread user
    const users = flatFilterValues(posts.map(({ userId }) => userId).concat(thread.userId))
    this.fetchUsers({ ids: users })
  }
}
</script>

<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <!-- event and tag props are deprecated. Use scoped slots instead. -->
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
        v-slot="{ navigate }"
        class="btn-green btn-small"
        ><button @click="navigate" role="link">Edit Thread</button></router-link
      >
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
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
