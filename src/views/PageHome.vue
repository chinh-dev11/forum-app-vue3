<script>
import CategoryList from '@/components/CategoryList.vue'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  }
}
</script>

<template>
  <CategoryList :categories="categories" />
</template>

<style scoped></style>
