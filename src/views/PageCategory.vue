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
      return findById(this.$store.state.categories.items, this.catId)
    },
    categoryForums () {
      return this.$store.state.forums.items.filter(
        ({ categoryId }) => categoryId === this.category.id
      )
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums'])
  },
  async created () {
    const category = await this.fetchCategory({ id: this.catId })
    await this.fetchForums({ ids: category.forums })

    this.asyncDataStatus_fetched() // show content once data is fetched.
  }
}
</script>

<template>
  <div v-if="asyncDataStatus_ready">
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
