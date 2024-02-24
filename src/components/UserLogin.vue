<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  created () {
    this.$emit('ready')
  },
  methods: {
    ...mapActions(['signInUser', 'signInUserWithGoogle']),
    async signInWithGoogle () {
      const user = await this.signInUserWithGoogle()

      if (user?.id) {
        this.$router.push({ name: 'Home' })
        return
      }

      switch (user.error.code) {
        case 'auth/popup-closed-by-user':
          break
        case '...':
          break
        default:
      }
    },
    async signIn () {
      const res = await this.signInUser(this.form)

      if (res.user?.uid) {
        this.$router.push({ name: 'Home' })
        return
      }

      switch (res.error.code) {
        // auth/invalid-credential: unknown email, wrong password.
        case 'auth/invalid-credential':
          // TODO: need to differentiate between wrong password and email not registered.
          // this.$router.push({ name: 'Register' })
          break
        case 'auth/missing-password':
          // TODO: highlight the missing field.
          break
        default:
      }
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="flex-grid justify-center">
      <div class="col-2">
        <form @submit.prevent="signIn" class="card card-form">
          <h1 class="text-center">Login</h1>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="form.email"
              id="email"
              type="text"
              class="form-input"
              autocomplete="email"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              v-model="form.password"
              id="password"
              type="password"
              class="form-input"
              autocomplete="current-password"
              required
            />
          </div>

          <div class="push-top">
            <button type="submit" class="btn-blue btn-block">Log in</button>
          </div>

          <div class="form-actions text-right">
            <router-link :to="{ name: 'Register' }"
              >Create an account?</router-link
            >
          </div>
        </form>

        <div class="push-top text-center">
          <button @click="signInWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="forum-stats desktop-only push-top">
    <hr />
    <ul>
      <li><i class="fa fa-user-circle-o"></i>47 users online</li>
      <li><i class="fa fa-user-o"></i>497 users registered</li>
      <li><i class="fa fa-comments-o"></i>49 threads</li>
      <li><i class="fa fa-comment-o"></i>763 posts</li>
    </ul>
  </div> -->
</template>

<style lang="scss" scoped></style>
