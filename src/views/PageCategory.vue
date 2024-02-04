<script>
import ForumList from '@/components/ForumList.vue'
import { findById } from '@/helpers'

export default {
  components: { ForumList },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id) || {}
    },
    categoryForums () {
      return this.$store.state.forums.filter(({ categoryId }) => categoryId === this.category.id)
    }
  },
  async created () {
    const category = await this.$store.dispatch('fetchCategory', { id: this.id })
    this.$store.dispatch('fetchForums', { ids: category.forums })
  }
}
</script>

<template>
  <div class="col-full push-top">
    <h1>{{ category.name }}</h1>
  </div>
  <ForumList
    :forums="categoryForums"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<style scoped></style>
