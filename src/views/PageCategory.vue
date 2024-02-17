<script>
import ForumList from '@/components/ForumList.vue'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { ForumList },
  mixins: [asyncDataStatus],
  props: {
    catId: {
      type: String,
      required: true
    }
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.catId)
    },
    categoryForums () {
      return this.$store.state.forums.filter(
        ({ categoryId }) => categoryId === this.category.id
      )
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums'])
  },
  async created () {
    const category = await this.fetchCategory({ id: this.catId })
    await this.fetchForums({ ids: category.forums })

    this.asyncDataStatus_fetched()
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready" class="container">
    <div class="col-full push-top">
      <h1>{{ category.name }}</h1>
    </div>
    <ForumList
      :forums="categoryForums"
      :title="category.name"
      :category-id="category.id"
    />
  </div>
</template>

<style scoped></style>
