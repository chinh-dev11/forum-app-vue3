<script>
import ForumList from '@/components/ForumList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

export default {
  components: { ForumList },
  props: {
    catId: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.catId) || {}
    },
    categoryForums () {
      return this.$store.state.forums.filter(({ categoryId }) => categoryId === this.category.id)
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  async created () {
    const category = await this.fetchCategory({ id: this.catId })
    this.fetchForums({ ids: category.forums })
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
