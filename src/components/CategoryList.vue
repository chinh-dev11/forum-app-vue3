<script>
import ForumList from '@/components/ForumList.vue'
import { flatFilterValues } from '@/helpers'

export default {
  components: { ForumList },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  async created () {
    const forumIds = flatFilterValues(this.categories.map(({ forums }) => forums))

    // fetch forums of categories
    const forums = await this.$store.dispatch('fetchForums', { ids: forumIds })

    const threadIds = flatFilterValues(forums.map(({ threads }) => threads).flat())
    // fetch threads of forums
    const threads = await this.$store.dispatch('fetchThreads', { ids: threadIds })

    const threadUserIds = flatFilterValues(threads.map(({ userId }) => userId))
    // fetch users of threads
    this.$store.dispatch('fetchUsers', { ids: threadUserIds })

    const threadContributorsIds = flatFilterValues(threads.map(({ contributors }) => contributors).flat())
    // fetch contributors of threads
    this.$store.dispatch('fetchUsers', { ids: threadContributorsIds }) // 12

    const threadPostsIds = flatFilterValues(threads.map(({ posts }) => posts).flat())
    // fetch posts of threads
    this.$store.dispatch('fetchPosts', { ids: threadPostsIds })
    // fetching users of the posts are not needed since the users are already fetched with threads userId and contributors (posts)
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(
        ({ categoryId }) => categoryId === category.id
      )
    }
  }
}
</script>

<template>
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<style scoped></style>
