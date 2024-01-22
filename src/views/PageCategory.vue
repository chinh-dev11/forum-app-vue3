<script>
import dataSource from '@/data.json'
import ForumList from '@/components/ForumList.vue'

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
      return dataSource.categories.find((category) => category.id === this.id)
    },
    categoryForums () {
      return dataSource.forums.filter(f => f.categoryId === this.id)
    }
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

<style lang="scss" scoped></style>
