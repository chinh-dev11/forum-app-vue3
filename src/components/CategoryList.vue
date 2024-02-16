<script>
import ForumList from '@/components/ForumList.vue'
import { flatFilterValues } from '@/helpers'
import { mapActions } from 'vuex'

export default {
  components: { ForumList },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  methods: {
    ...mapActions(['fetchForums']),
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(
        ({ categoryId }) => categoryId === category.id
      )
    }
  },
  async created () {
    const forumIds = flatFilterValues(this.categories.map(({ forums }) => forums))
    // fetch forums of categories
    await this.fetchForums({ ids: forumIds })
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
