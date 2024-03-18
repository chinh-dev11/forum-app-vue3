<script>
import PostList from '@/components/PostList.vue'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileCardEditor from '@/components/UserProfileCardEditor.vue'
import { mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: { PostList, UserProfileCard, UserProfileCardEditor },
  mixins: [asyncDataStatus],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({ user: 'authUser' })
  },
  async created () {
    // fetch user's posts before displaying the page
    const posts = await this.$store.dispatch('fetchAuthUserPosts')

    this.asyncDataStatus_fetched()

    if (posts.error) {
    // TODO: manage error
    }
  }
}
</script>

<template>
  <div class="flex-grid">
    <div class="col-3 push-top">
      <UserProfileCardEditor v-if="edit" :user="user" />
      <UserProfileCard v-else :user="user" />
    </div>

    <div class="col-7 push-top">
      <div class="profile-header">
        <span class="text-lead"> {{ user.username }}'s recent activity </span>
        <a href="#">See only started threads?</a>
      </div>

      <hr />

      <PostList :posts="user.posts" />
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

<style scoped></style>
