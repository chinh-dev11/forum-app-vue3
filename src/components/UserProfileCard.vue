<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({ user: 'authUser' })
  }
}
</script>

<template>
  <div class="profile-card">
    <p class="text-center">
      <img
        :src="user.avatar"
        :alt="`${user.name} profile picture`"
        class="avatar-xlarge"
      />
    </p>

    <h1 class="title">{{ user.username }}</h1>

    <p class="text-lead">{{ user.name }}</p>

    <p class="text-justify">{{ user.bio || "No bio specified." }}</p>

    <span class="online">{{ user.username }} is online</span>

    <div class="stats">
      <span>{{ user.postsCount }} post{{ user.postsCount ? "s" : "" }}</span>
      <span
        >{{ user.threadsCount }} thread{{ user.threadsCount ? "s" : "" }}</span
      >
    </div>

    <hr />

    <p v-if="user.website" class="text-large text-center">
      <i class="fa fa-globe"></i>
      <a :href="user.website">{{ user.website }}</a>
    </p>

    <p class="text-xsmall text-faded text-center">
      Member since <app-date :timestamp="user.registeredAt" />, last visited
      <app-date :timestamp="user.lastVisitAt" />
    </p>

    <div class="text-center">
      <hr />
      <router-link
        :to="{ name: 'ProfileEdit', params: { edit: true } }"
        class="btn-green btn-small"
        >Edit Profile</router-link
      >
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
