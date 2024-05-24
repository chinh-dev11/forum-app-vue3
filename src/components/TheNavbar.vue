<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      userDropdownOpen: false,
      mobileNavMenu: false
    }
  },
  computed: {
    ...mapGetters('auth', ['authUser'])
  },
  methods: {
    ...mapActions('auth', ['signOutUser']),
    async signOut () {
      await this.signOutUser()
      this.$emit('ready')
      this.userDropdownOpen = false
      this.$router.push({ name: 'Home' })
    }
  },
  created () {
    // route guard to close the mobile menu on route change.
    // ie. when signOut, redirects to Home page.
    this.$router.beforeEach((to, from) => {
      this.mobileNavMenu = false
    })
  }
}
</script>

<template>
  <header
    v-click-outside="() => (mobileNavMenu = false)"
    v-page-scroll="() => (mobileNavMenu = false)"
    class="header"
    id="header"
  >
    <router-link :to="{ name: 'Home' }" class="logo">
      <img src="../assets/svg/vueschool-logo.svg" />
    </router-link>

    <div @click="mobileNavMenu = !mobileNavMenu" class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav :class="{ 'navbar-open': mobileNavMenu }" class="navbar">
      <ul>
        <li v-if="authUser" class="navbar-user">
          <a
            @click.prevent="userDropdownOpen = !userDropdownOpen"
            v-click-outside="() => (userDropdownOpen = false)"
            href="#"
          >
            <AppAvatarImg
              :src="authUser.avatar"
              :alt="authUser.name"
              size="small" />
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
                <router-link :to="{ name: 'Profile' }">My profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="signOut" href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
        <li v-if="!authUser" class="navbar-user">
          <router-link :to="{ name: 'Login' }" class="mr-md">Login</router-link>
        </li>
        <li v-if="!authUser" class="navbar-user">
          <router-link :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>

      <ul>
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
        <li class="navbar-item mobile-only">
          <router-link v-if="authUser" :to="{ name: 'Profile' }"
            >My profile</router-link
          >
          <router-link v-else :to="{ name: 'Login' }" class="mr-md"
            >Login</router-link
          >
        </li>
        <li class="navbar-item mobile-only">
          <a v-if="authUser" @click.prevent="signOut" href="#">Logout</a>
          <router-link v-else :to="{ name: 'Register' }">Register</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.mr-md {
  margin-right: 10px;
}
</style>
