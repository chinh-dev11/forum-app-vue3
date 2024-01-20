<script>
import dataSource from '@/data.json'
import PostList from '@/components/PostList.vue'

export default {
  components: { PostList },
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
      users: dataSource.users,
      newPostText: 'default value'
    }
  },
  methods: {
    userById (userId) {
      return this.users.find((u) => u.id === userId)
    },
    addPost () {
      const postId = 'aaaa-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated form DB.
      const post = {
        // edited: {},
        publishedAt: Math.floor(Date.now() / 1000), // in secs.
        text: this.newPostText,
        // text: this.$refs.newPostTextInput.value, // to fix browser error: Assertion failed: Input argument is not an HTMLInputElement.
        threadId: this.id,
        userId: 'Miej9zSGMRZKDvMXzfxjVOyv3RF3',
        id: postId
      }

      this.posts.push(post)
      this.thread.posts.push(postId)

      this.newPostText = ''
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
    <form action="" @submit.prevent="addPost">
      <div class="form-group">
        <label for="thread_title">Title:</label>
        <input type="text" id="thread_title" class="form-input" name="title" />
      </div>

      <div class="form-group">
        <label for="thread_content">Content:</label>
        <!-- since 2-way binding uses input event, it causes an error on textarea element 'Assertion failed: Input argument is not an HTMLInputElement' -->
        <textarea
          v-model="newPostText"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        ></textarea>
        <!-- to fix the error 'Assertion failed: Input argument is not an HTMLInputElement' -->
        <!-- <textarea
          :value="newPostText"
          ref="newPostTextInput"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        /> -->
      </div>
      <div class="btn-group">
        <button class="btn btn-ghost">Cancel</button>
        <button class="btn btn-blue" type="submit" name="Publish">
          Publish
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
