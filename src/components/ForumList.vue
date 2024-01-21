<script>
export default {
  props: {
    forums: {
      type: Array,
      required: true
    }
  }
}
</script>

<template>
  <div class="forum-list">
    <h2 class="list-title">
      <a href="#">Forums</a>
    </h2>
    <div v-for="forum in forums" :key="forum.id" class="forum-listing">
      <div class="forum-details">
        <router-link :to="{name:'Forum',params:{id:forum.id}}" class="text-xlarge" href="#">{{ forum.name }}</router-link>
        <p>{{ forum.description }}.</p>
      </div>

      <div class="threads-count">
        <p>
          <span class="count">{{ forum.threads?.length || 0 }}</span> thread{{ forum.threads?.length ? 's' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
