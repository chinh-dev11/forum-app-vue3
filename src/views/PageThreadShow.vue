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
      users: dataSource.users
    }
  },
  methods: {
    userById (userId) {
      return this.users.find((user) => user.id === userId)
    }
  },
  computed: {
    thread () {
      return this.threads.find((t) => t.id === this.id)
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
    <PostList :thread="thread"/>
  </div>
</template>

<style scoped></style>
