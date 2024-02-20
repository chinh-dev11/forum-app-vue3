<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      open: false
    }
  },
  computed: {
    ...mapGetters(['authUser'])
  },
  methods: {
    ...mapActions(['signOutUser']),
    async signOut () {
      await this.signOutUser()
      this.$emit('ready')
    },
    hover (evt) {
      this.open = evt.type === 'mouseover'
    }
  }
}
</script>

<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <!-- <div class="btn-hamburger"> -->
    <!-- use .btn-humburger-active to open the menu -->
    <!-- <div class="top bar"></div> -->
    <!-- <div class="middle bar"></div> -->
    <!-- <div class="bottom bar"></div> -->
    <!-- </div> -->

    <!-- use .navbar-open to open nav -->
    <nav :class="{ 'navbar-open': open }" class="navbar">
      <ul v-if="authUser.id" @mouseover="hover" @mouseleave="hover">
        <li class="navbar-user">
          <a href="#"
            ><img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`" />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              /> </span
          ></a>
          <!-- <router-link :to="{ name: 'Profile' }">
            <img
              class="avatar-small"
              :src="authUser.avatar"
              :alt="`${authUser.name} profile picture`"
            />
            <span>
              {{ authUser.name }}
              <img
                class="icon-profile"
                src="../assets/svg/arrow-profile.svg"
                alt=""
              />
            </span>
          </router-link> -->

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': open }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <a href="#">View profile</a>
              </li>
              <li class="dropdown-menu-item">
                <a @click="signOut" href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
      <div v-else><router-link :to="{ name: 'Login' }">Login</router-link></div>

      <!-- <ul> -->
      <!-- <li class="navbar-item">
          <router-link :to="{ name: 'Home' }">Home</router-link>
        </li>
        <li class="navbar-item">
          <router-link
            :to="{ name: 'Category', params: { catId: 'nonexistent' } }"
            >Category</router-link
          >
        </li>
        <li class="navbar-item">
          <router-link
            :to="{ name: 'Forum', params: { forumId: 'nonexistent' } }"
            >Forum</router-link
          >
        </li>
        <li class="navbar-item">
          <router-link
            :to="{ name: 'Thread', params: { threadId: 'nonexistent' } }"
            >Thread</router-link
          >
        </li> -->
      <!-- Show these option only on mobile-->
      <!-- <li class="navbar-item mobile-only">
          <a href="#">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li> -->
      <!-- </ul> -->
    </nav>
  </header>
</template>

<style scoped></style>
