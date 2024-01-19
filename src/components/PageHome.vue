<!-- Composition API -->
<!-- <script>
import dataSource from '@/data.json'
import { reactive } from 'vue'
export default {
  setup () {
    const threads = reactive(dataSource.threads)
    const posts = reactive(dataSource.posts)
    const users = reactive(dataSource.users)

    function postById (postId) {
      return posts.find(p => p.id === postId)
    }
    function userById (userId) {
      return users.find(u => u.id === userId)
    }

    return {
      threads,
      posts,
      users,
      postById,
      userById
    }
  }
}
</script> -->
<!-- <script setup>
import dataSource from '@/data.json'
import { reactive } from 'vue'

const threads = reactive(dataSource.threads)
const posts = reactive(dataSource.posts)
const users = reactive(dataSource.users)

function postById (postId) {
  return posts.find(p => p.id === postId)
}
function userById (userId) {
  return users.find(u => u.id === userId)
}
</script>
 -->

<!-- Options API -->
<script>
import dataSource from '@/data.json'

export default {
  data () {
    return {
      threads: dataSource.threads,
      posts: dataSource.posts,
      users: dataSource.users
    }
  },
  methods: {
    postById (postId) {
      return this.posts.find(p => p.id === postId)
    },
    userById (userId) {
      return this.users.find(u => u.id === userId)
    }
  }
}
</script>

<template>
<div v-for="thread in threads" :key="thread.id">
    <h2>{{ thread.title }}</h2>
    <div v-for="postId in thread.posts" :key="postId">
      <h3>
        {{ userById(postById(postId).userId).name }}
      </h3>
      <p>{{ postById(postId).text }}</p>
    </div>
</div>
</template>

<style scoped>

</style>
