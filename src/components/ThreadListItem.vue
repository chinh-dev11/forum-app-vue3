<script>
export default {
  props: {
    thread: {
      type: Object,
      required: true
    }
  },
  methods: {
    postById (postId) {
      return this.$store.state.posts.find((p) => p.id === postId)
    },
    userById (userId) {
      return this.$store.state.users.find((u) => u.id === userId)
    }
  }
}
</script>

<template>
  <div class="thread">
    <div>
      <p>
        <router-link :to="{ name: 'ThreadShow', params: { id: thread.id } }">{{
          thread.title
        }}</router-link>
      </p>
      <p class="text-faded text-xsmall">
        By <a href="profile.html">{{ userById(thread.userId).name }}</a
        >,
        <app-date :timestamp="thread.publishedAt" />
      </p>
    </div>
    <div class="activity">
      <p class="replies-count">{{ thread.posts.length }} replies</p>
      <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />
      <div>
        <p class="text-xsmall">
          <a href="profile.html">{{ userById(thread.userId).name }}</a>
        </p>
        <p class="text-xsmall text-faded">
          <app-date :timestamp="thread.publishedAt" />
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thread-list .thread {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0 5px 20px;
  min-height: 45px;
}

.thread-list .thread:nth-child(odd) {
  background: rgba(73, 89, 96, 0.06);
  border-bottom-left-radius: 20px;
}

.thread-list .thread:last-child {
  border-bottom-left-radius: 0;
}

.thread-list .thread .replies-count {
  flex-basis: 35%;
}

.thread-list .thread .activity {
  flex-basis: 35%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.thread-list .thread .activity .avatar-medium {
  margin-right: 10px;
}

.thread-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
