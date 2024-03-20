<script>
import { mapActions } from 'vuex'

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      activeUser: {
        ...this.user
      }
    }
  },
  methods: {
    ...mapActions('users', ['updateUser']),
    save () {
      const userUpdated = this.updateUser({ ...this.activeUser }) // clone the activeUser object: to prevent changes referenced to it before it's actually set to the users.
      this.$router.push({ name: 'Profile' }) // redirect to the profile page after save.

      if (userUpdated.error) {
        // TODO: manage error
      }
    },
    cancel () {
      // might want to notity the user of the change might be lost if continue.
      this.$router.push({ name: 'Profile' }) // redirect to the profile page.
    }
  }
}
</script>

<template>
  <div class="col-3 push-top">
    <form @submit.prevent="save" class="profile-card">
      <p class="text-center">
        <img
          :src="user.avatar"
          :alt="`${user.name} profile picture`"
          class="avatar-xlarge img-update"
        />
      </p>
      <div class="form-group">
        <input
          v-model="activeUser.username"
          type="text"
          placeholder="Username"
          class="form-input text-lead text-bold"
        />
      </div>
      <div class="form-group">
        <input
          v-model="activeUser.name"
          type="text"
          placeholder="Full Name"
          class="form-input text-lead"
        />
      </div>
      <div class="form-group">
        <label for="user_bio">Bio</label>
        <textarea
          v-model="activeUser.bio"
          class="form-input"
          id="user_bio"
          placeholder="Write a few words about yourself."
        ></textarea>
      </div>
      <div class="stats">
        <span>{{ user.postsCount }} posts</span>
        <span>{{ user.threadsCount }} threads</span>
      </div>
      <hr />
      <div class="form-group">
        <label class="form-label" for="user_website">Website</label>
        <input
          v-model="activeUser.website"
          autocomplete="off"
          class="form-input"
          id="user_website"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="user_email">Email</label>
        <input
          v-model="activeUser.email"
          autocomplete="off"
          class="form-input"
          id="user_email"
        />
      </div>
      <div class="form-group">
        <label class="form-label" for="user_location">Location</label>
        <input
          v-model="activeUser.location"
          autocomplete="off"
          class="form-input"
          id="user_location"
        />
      </div>
      <div class="btn-group space-between">
        <button @click="cancel" class="btn-ghost">Cancel</button>
        <button type="submit" class="btn-blue">Save</button>
      </div>
    </form>
  </div>

  <!-- <div class="col-7 push-top">

        <div class="profile-header">
            <span class="text-lead">
                Joker's recent activity
            </span>
            <a href="#">See only started threads?</a>
        </div>

        <hr>

        <div class="activity-list">
            <div class="activity">
                <div class="activity-header">
                    <img src="https://i.imgur.com/OqlZN48.jpg" alt="" class="hide-mobile avatar-small">
                    <p class="title">
                        How can I chop onions without crying?
                        <span>Joker started a topic in Cooking</span>
                    </p>

                </div>

                <div class="post-content">
                    <p>I absolutely love onions, but they hurt my eyes! Is there a way where you can chop onions without crying?</p>
                </div>

                <div class="thread-details">
                    <span>4 minutes ago</span>
                    <span>1 comments</span>
                </div>
            </div>

            <div class="activity">
                    <div class="activity-header">

                        <img src="http://i.imgur.com/s0AzOkO.png" alt="" class="hide-mobile avatar-small">

                        <p class="title">
                            Wasabi vs horseraddish?
                            <span>Joker replied to Robin's topic in Cooking</span>
                        </p>

                    </div>

                    <div class="post-content">

                        <blockquote class="small">
                            <div class="author">
                                <a href="/user/robin" class=""> robin</a>
                                <span class="time">a month ago</span>
                                <i class="fa fa-caret-down"></i>
                            </div>

                            <div class="quote">
                              <p>Is horseradish and Wasabi the same thing? I&amp;#39;ve heard so many different things.</p>
                            </div>
                        </blockquote>

                        <p>They're not the same!</p>
                    </div>

                    <div class="thread-details">
                        <span>2 days ago</span>
                        <span>1 comment</span>
                    </div>
            </div>

            <div class="activity">
                <div class="activity-header">
                    <img src="https://i.imgur.com/OqlZN48.jpg" alt="" class="hide-mobile avatar-small">
                    <p class="title">
                        Where is the sign in button??????!?!?!?!
                        <span>Joker replied to his own topic in Questions & Feedback</span>
                    </p>

                </div>

                <div class="post-content">
                    <p><strong><i>Post deleted due to inappropriate language</i></strong></p>
                </div>

                <div class="thread-details">
                    <span>7 days ago</span>
                    <span>7 comments</span>
                </div>
            </div>

        </div>
    </div> -->
</template>

<style scoped></style>
