<script>
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'

export default {
  components: { CategoryList },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  methods: {
    ...mapActions(['fetchAllCategories'])
  },
  created () {
    // fetch all categories
    this.fetchAllCategories()
  }
}
</script>

<template>
  <CategoryList v-if="categories.length" :categories="categories" />
</template>

<style scoped></style>
