<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
import { mapActions, mapGetters } from 'vuex'
import { flatFilterValues } from '@/helpers'
import asyncDataStatus from '@/mixins/asyncDataStatus'
import useNotifications from '@/composables/useNotifications'
import { difference } from 'lodash'

export default {
  components: { PostList, PostEditor },
  mixins: [asyncDataStatus],
  props: {
    threadId: {
      type: String,
      required: true
    }
  },
  setup () {
    const { addNotification } = useNotifications()

    return { addNotification }
  },
  computed: {
    ...mapGetters('auth', ['authUser']),
    thread () {
      return this.$store.getters['threads/thread'](this.threadId)
    },
    threadPosts () {
      return this.$store.state.posts.items.filter(
        ({ threadId }) => threadId === this.thread.id
      )
    },
    canEditThread () {
      return this.thread.userId === this.authUser.id
    }
  },
  methods: {
    ...mapActions('posts', ['createPost', 'fetchPosts']),
    ...mapActions('threads', ['fetchThread']),
    ...mapActions('users', ['fetchUsers']),
    savePost ({ post }) {
      this.createPost({ post: { ...post, threadId: this.thread.id } })
    },
    async fetchPostsWithUsers (ids) {
      const posts = await this.fetchPosts({
        ids,
        cbOnSnapshot: ({ isLocal, previousItem }) => {
          if (!this.asyncDataStatus_ready || isLocal || (previousItem?.edited && !previousItem?.edited?.at)) return // no notification if initial fetch or in same browser tab.

          this.addNotification({ message: 'Thread recently updated.' })
        }
      })
      // fetch the posts associated users and the thread user.
      const users = flatFilterValues(
        posts.map(({ userId }) => userId).concat(this.thread.userId)
      )
      await this.fetchUsers({ ids: users })
    }
  },
  // using created to ensure the reactivity of the computed props, instead of beforeCreate hook.
  async created () {
    const thread = await this.fetchThread({
      id: this.threadId,
      cbOnSnapshot: ({ isLocal, item, previousItem }) => {
        if (!this.asyncDataStatus_ready || isLocal) return // no notification if initial fetch or in same browser tab.

        const newPosts = difference(item.posts, previousItem.posts)
        const hasNewPosts = newPosts.length > 0
        if (hasNewPosts) {
          this.fetchPostsWithUsers(newPosts)
        } else {
          this.addNotification({ message: 'Thread recently updated.' })
        }
      }
    })

    await this.fetchPostsWithUsers(thread.posts)

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top">
    <h1>
      {{ thread.title }}
      <router-link
        v-if="canEditThread"
        :to="{ name: 'ThreadEdit', params: { threadId: thread.id } }"
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
    <PostEditor v-if="authUser.id" @save="savePost" />
    <div v-else class="text-center">
      <router-link :to="{ name: 'Login', query: { redirectTo: $route.path } }"
        >Sign In</router-link
      >
      or
      <router-link
        :to="{ name: 'Register', query: { redirectTo: $route.path } }"
        >Register</router-link
      >
      to edit and/or reply.
    </div>
  </div>
</template>

<style scoped></style>
