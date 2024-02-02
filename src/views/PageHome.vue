<script>
import CategoryList from '@/components/CategoryList.vue'
import { flatFilterValues } from '@/helpers'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async beforeCreate () {
    // fetch all categories
    const categories = await this.$store.dispatch('fetchAllCategories')

    const forumIds = flatFilterValues(categories.map(({ forums }) => forums))
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
  }
}
</script>

<template>
  <CategoryList :categories="categories" />
</template>

<style scoped></style>
