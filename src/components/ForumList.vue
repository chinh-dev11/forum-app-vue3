<script>
export default {
  props: {
    forums: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Forum'
    },
    categoryId: {
      type: String,
      required: false
    }
  }
}
</script>

<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <router-link v-if="categoryId" :to="{ name: 'Category', params: { catId: categoryId } }">{{
          title
        }}</router-link>
        <span v-else>{{ title }}</span>
      </h2>
      <div v-for="forum in forums" :key="forum.id" class="forum-listing">
        <div class="forum-details">
          <router-link
            :to="{ name: 'Forum', params: { forumId: forum.id } }"
            class="text-xlarge"
            >{{ forum.name }}</router-link
          >
          <p>{{ forum.description }}.</p>
        </div>

        <div class="threads-count">
          <p>
            <span class="count">{{ forum.threads?.length || 0 }}</span> thread{{
              forum.threads?.length ? "s" : ""
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
