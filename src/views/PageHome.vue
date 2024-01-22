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
  <h1>Welcome to the Forum</h1>
  <!--
     category > forums
        forum > threads
            thread > posts
   -->
    <CategoryList :categories="categories" />
</template>

<style scoped></style>
