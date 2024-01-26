<script>
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
      return this.$store.state.categories.find(
        (category) => category.id === this.id
      )
    },
    forumsForCategory () {
      return this.$store.state.forums.filter(
        ({ categoryId }) => categoryId === this.id
      )
    }
  }
}
</script>

<template>
  <div class="col-full push-top">
    <h1>{{ category.name }}</h1>
  </div>
  <ForumList
    :forums="forumsForCategory"
    :title="category.name"
    :category-id="category.id"
  />
</template>

<style scoped></style>
