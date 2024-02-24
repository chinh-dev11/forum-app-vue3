<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      userDropdownOpen: false
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
      this.userDropdownOpen = false
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
    <nav :class="{ 'navbar-open': userDropdownOpen }" class="navbar">
      <ul>
        <li v-if="authUser.id" class="navbar-user">
          <a @click.prevent="userDropdownOpen = !userDropdownOpen" href="#"
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

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{ 'active-drop': userDropdownOpen }">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{ name: 'Profile' }"
                  >View profile</router-link
                >
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut" href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-else>
          <router-link :to="{ name: 'Login' }" class="mr-md">Login</router-link>
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>

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

<style scoped>
.mr-md {
  margin-right: 10px;
}
</style>
