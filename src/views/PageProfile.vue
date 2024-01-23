<script>
import PostList from '@/components/PostList.vue'
import { mapGetters } from 'vuex'

export default {
  components: { PostList },
  computed: {
    ...mapGetters({ user: 'authUser' }),
    userPosts () {
      return this.$store.state.posts.filter(({ userId }) => userId === this.user.id)
    },
    userThreads () {
      return this.$store.state.threads.filter(
        ({ userId }) => userId === this.user.id
      )
    }
  }
}
</script>

<template>
  <div class="flex-grid">
    <div class="col-3 push-top">
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
          <span
            >{{ userPosts.length }} post{{ userPosts.length ? "s" : "" }}</span
          >
          <span
            >{{ userThreads.length }} thread{{
              userThreads.length ? "s" : ""
            }}</span
          >
        </div>

        <hr />

        <p v-if="user.website" class="text-large text-center">
          <i class="fa fa-globe"></i>
          <a :href="user.website">{{ user.website }}</a>
        </p>
      </div>

      <p class="text-xsmall text-faded text-center">
        Member since <app-date :timestamp="user.registeredAt" />, last visited
        <app-date :timestamp="user.lastVisitAt" />
      </p>

      <div class="text-center">
        <hr />
        <a href="#" class="btn-green btn-small">Edit Profile</a>
      </div>
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.username }}'s recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <post-list :posts="userPosts" />
      <!-- <div class="activity-list">
        <div class="activity">
          <div class="activity-header">
            <img
              src="https://i.imgur.com/OqlZN48.jpg"
              alt=""
              class="hide-mobile avatar-small"
            />
            <p class="title">
              How can I chop onions without crying?
              <span>Joker started a topic in Cooking</span>
            </p>
          </div>

          <div class="post-content">
            <div>
              <p>
                I absolutely love onions, but they hurt my eyes! Is there a way
                where you can chop onions without crying?
              </p>
            </div>
          </div>

          <div class="thread-details">
            <span>4 minutes ago</span>
            <span>1 comments</span>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
