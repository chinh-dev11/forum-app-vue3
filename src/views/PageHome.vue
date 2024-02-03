<script>
import CategoryList from '@/components/CategoryList.vue'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async beforeCreate () {
    // fetch all categories
    this.$store.dispatch('fetchAllCategories')
  }
}
</script>

<template>
  <CategoryList :categories="categories" />
</template>

<style scoped></style>
