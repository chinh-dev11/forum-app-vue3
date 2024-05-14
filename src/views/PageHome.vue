<script>
import CategoryList from '@/components/CategoryList.vue'
import { mapActions } from 'vuex'
import { flatFilterValues } from '@/helpers'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { CategoryList },
  mixins: [asyncDataStatus],
  computed: {
    categories () {
      return this.$store.state.categories.items
    }
  },
  methods: {
    ...mapActions('categories', ['fetchAllCategories']),
    ...mapActions('forums', ['fetchForums'])
  },
  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = flatFilterValues(categories.map(({ forums }) => forums))
    await this.fetchForums({ ids: forumIds })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready">
    <div class="col-full push-top">
      <h1>Welcome to the Forum</h1>
    </div>
    <CategoryList :categories="categories" />
  </div>
</template>

<style scoped></style>
