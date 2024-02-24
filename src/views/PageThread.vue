<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { mapActions } from 'vuex'
import { flatFilterValues } from '@/helpers'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { PostList, PostEditor },
  mixins: [asyncDataStatus],
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      return this.$store.getters.thread(this.threadId)
    },
    threadPosts () {
      return this.$store.state.posts.filter(
        ({ threadId }) => threadId === this.thread.id
      )
    },
    isUserAuthenticated () {
      return this.$store.getters.authUser.id
    }
  },
  methods: {
    ...mapActions(['createPost', 'fetchThread', 'fetchPosts', 'fetchUsers']),
    savePost ({ post }) {
      this.createPost({ post: { ...post, threadId: this.thread.id } })
    }
  },
  // using created to ensure the reactivity of the computed props, instead of beforeCreate hook.
  async created () {
    const thread = await this.fetchThread({ id: this.threadId })
    const posts = await this.fetchPosts({ ids: thread.posts })
    // fetch the posts associated users and the thread user.
    const users = flatFilterValues(
      posts.map(({ userId }) => userId).concat(thread.userId)
    )
    await this.fetchUsers({ ids: users })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-large push-top">
      <h1>
        {{ thread.title }}
        <router-link
          :to="{ name: 'ThreadEdit', params: { threadId: thread.id } }"
          v-slot="{ navigate }"
          class="btn-green btn-small"
          ><button @click="navigate" role="link">
            Edit Thread
          </button></router-link
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
      <PostEditor v-if="isUserAuthenticated" @save="savePost" />
    </div>
  </div>
</template>

<style scoped></style>
