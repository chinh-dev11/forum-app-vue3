<script>
import CategoryList from '@/components/CategoryList.vue'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async created () {
    // fetch all categories
    await this.$store.dispatch('fetchAllCategories')
  }
}
</script>

<template>
  <CategoryList v-if="categories.length" :categories="categories" />
</template>

<style scoped></style>
