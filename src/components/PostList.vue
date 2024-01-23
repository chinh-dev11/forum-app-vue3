<script>
import PostListItem from '@/components/PostListItem.vue'

export default {
  components: { PostListItem },
  props: {
    posts: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
    <div class="post-list">
      <post-list-item v-for="post in posts" :key="post.id" :post="post" />
    </div>
</template>

<style scoped>
.post-list {
  margin-top: 20px;
}
</style>
