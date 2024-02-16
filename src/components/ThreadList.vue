<script>
export default {
  props: {
    threads: {
      type: Array,
      required: true
    }
  },
  methods: {
    userById (userId) {
      return this.$store.getters.user(userId)
    },
    threadById (threadId) {
      return this.$store.getters.thread(threadId)
    }
  }
}
</script>

<template>
  <div class="col-full">
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <div v-for="thread in threads" :key="thread.id" class="thread">
        <div>
          <p>
            <router-link
              :to="{ name: 'Thread', params: { threadId: thread.id } }"
              >{{ threadById(thread.id).title }}</router-link
            >
          </p>
          <p class="text-faded text-xsmall">
            By <a href="profile.html">{{ userById(thread.userId).name }}</a
            >,
            <AppDate :timestamp="userById(thread.userId).registeredAt" />
          </p>
        </div>
        <div class="activity">
          <p class="replies-count">{{ threadById(thread.id).repliesCount }} replies</p>
          <img class="avatar-medium" :src="userById(thread.userId).avatar" alt="" />
          <div>
            <p class="text-xsmall">
              <a href="profile.html">{{ userById(thread.userId).name }}</a>
            </p>
            <p class="text-xsmall text-faded">
              <AppDate :timestamp="threadById(thread.id).publishedAt" />
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.thread-list {
  padding: 0;
  background-color: white;
}

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
