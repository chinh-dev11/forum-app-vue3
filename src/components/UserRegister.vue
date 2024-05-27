<script>
import { mapActions } from 'vuex'
import { Form, Field } from 'vee-validate'
export default {
  components: {
    VeeForm: Form,
    VeeField: Field
  },
  data () {
    return {
      avatarPreview: null,
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
    ...mapActions('auth', [
      'registerUserWithEmailAndPassword',
      'signInUserWithGoogle'
    ]),
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
    },
    handleAvatarUpload (e) {
      this.form.avatar = e.target.files[0]

      const reader = new FileReader()
      reader.onload = (event) => {
        this.avatarPreview = event.target.result
      }
      reader.readAsDataURL(this.form.avatar)
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
        <VeeForm
          @submit="register"
          class="card card-form"
          :validation-schema="{
            name: (value) => {
              console.log('name', name);
              if (value && value.trim()) return true;
              return 'This is required';
            },
            useranme: (value) => {
              console.log('username', username);
              if (value && value.trim()) return true;
              return 'This is required';
            },
          }"
        >
          <h1 class="text-center">Register</h1>
          <div class="form-group">
            <label for="name">Full Name</label>
            <VeeField
              name="name"
              v-model="form.name"
              id="name"
              type="text"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <VeeField
              name="username"
              v-model="form.username"
              id="username"
              type="text"
              class="form-input"
              autocomplete="username"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <VeeField
              name="email"
              v-model="form.email"
              id="email"
              type="email"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <VeeField
              name="password"
              v-model="form.password"
              id="password"
              type="password"
              class="form-input"
              autocomplete="current-password"
            />
          </div>
          <div class="form-group">
            <label for="avatar">
              Avatar
              <div v-if="avatarPreview">
                <img
                  :src="avatarPreview"
                  class="avatar-xlarge"
                  alt="user pic"
                />
              </div>
            </label>
            <VeeField
              name="avatar"
              v-show="!avatarPreview"
              @change="handleAvatarUpload"
              type="file"
              accept="image/*"
              id="avatar"
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-blue btn-block">Register</button>
          </div>
        </VeeForm>
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
