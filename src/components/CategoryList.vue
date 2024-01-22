<script>
import ForumList from '@/components/ForumList.vue'
import dataSource from '@/data.json'

export default {
  components: { ForumList },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  methods: {
    getForumsForCategory (category) {
      return dataSource.forums.filter(
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
