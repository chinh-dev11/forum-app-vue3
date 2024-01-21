<script>
import dataSource from '@/data.json'
import ForumList from '@/components/ForumList.vue'

export default {
  components: { ForumList },
  data () {
    return {
      forums: dataSource.forums
    }
  }
}
</script>

<template>
    <h1>Welcome to the Forum</h1>
    <div class="col-full">
      <ForumList :forums="forums" />
    </div>
</template>

<style scoped></style>
