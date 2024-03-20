<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      form: {
        name: '',
        username: '',
        email: '',
        password: '',
        avatar: ''
      }
    }
  },
  methods: {
    ...mapActions('users', ['registerUserWithEmailAndPassword', 'signInUserWithGoogle']),
    async signUpWithGoogle () {
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
    async register () {
      const user = await this.registerUserWithEmailAndPassword(this.form)

      if (!user.error) {
        this.$router.push({ name: 'Home' })
      } else {
        console.error(user.error)
        // TODO: manage error
      }
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<template>
  <div class="container">
    <div class="flex-grid justify-center">
      <div class="col-2">
        <form @submit.prevent="register" class="card card-form">
          <h1 class="text-center">Register</h1>

          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              v-model="form.name"
              id="name"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input
              v-model="form.username"
              id="username"
              type="text"
              class="form-input"
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              v-model="form.email"
              id="email"
              type="email"
              class="form-input"
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
            />
          </div>

          <div class="form-group">
            <label for="avatar">Avatar</label>
            <input
              v-model="form.avatar"
              id="avatar"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-blue btn-block">Register</button>
          </div>
        </form>
        <div class="text-center push-top">
          <button @click="signUpWithGoogle" class="btn-red btn-xsmall">
            <i class="fa fa-google fa-btn"></i>Sign up with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
