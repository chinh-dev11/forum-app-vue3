<script>
import PostListItem from '@/components/PostListItem.vue'

export default {
  components: { PostListItem },
  props: {
    thread: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
    <div class="post-list">
      <PostListItem v-for="postId in thread.posts" :key="postId" :postId="postId" />
    </div>
</template>

<style scoped>
.post-list {
  margin-top: 20px;
}
</style>
