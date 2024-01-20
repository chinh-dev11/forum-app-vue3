<script>
import dataSource from '@/data.json'
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
  data () {
    return {
      threads: dataSource.threads,
      posts: dataSource.posts,
      users: dataSource.users
    }
  },
  methods: {
    userById (userId) {
      return this.users.find((u) => u.id === userId)
    },
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }

      this.posts.push(post)
      this.thread.posts.push(post.id)
    }
  },
  computed: {
    thread () {
      return this.threads.find((t) => t.id === this.id)
    },
    threadPosts () {
      return this.posts.filter((p) => p.threadId === this.id)
    }
  }
}
</script>

<template>
  <div class="col-large push-top">
    <h1>{{ thread.title }}</h1>
    <p>
      By <a href="#" class="link-unstyled">{{ userById(thread.userId).name }}</a
      >, {{ thread.publishedAt }}.
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >3 replies by 3 contributors</span
      >
    </p>
    <PostList :posts="threadPosts" />
    <PostEditor @save="addPost" />
  </div>
</template>

<style scoped></style>
