import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import PageThread from '@/views/PageThread.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import PageForum from '@/views/PageForum.vue'
import PageCategory from '@/views/PageCategory.vue'
import PageProfile from '@/views/PageProfile.vue'
import PageThreadCreate from '@/views/PageThreadCreate.vue'
import PageThreadEdit from '@/views/PageThreadEdit.vue'
import UserRegister from '@/components/UserRegister.vue'
import UserLogin from '@/components/UserLogin.vue'
import store from '@/store'
import { findById } from '@/helpers'

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: UserLogin,
    meta: { requiresGuest: true }
  },
  {
    name: 'Logout',
    path: '/logout',
    async beforeEnter (to, from) {
      await store.dispatch('signOutUser')
      return { name: 'Home' }
    }
  },
  {
    name: 'Register',
    path: '/register',
    component: UserRegister,
    meta: { requiresGuest: true }
  },
  {
    name: 'ProfileEdit',
    path: '/me/edit',
    component: PageProfile,
    props: { edit: true }, // pass in 'edit' prop as boolean type (true/false).
    meta: { requiresAuth: true }
  },
  {
    name: 'Profile',
    path: '/me',
    component: PageProfile,
    meta: { toTop: true, smothScroll: true, requiresAuth: true } // scroll top smoothly. e.g. in case when editing profile.
    // beforeEnter (to, from) {},
    // beforeUpdate (to, from) {},
    // beforeLeave (to, from) {}
  },
  {
    name: 'Category',
    path: '/category/:catId',
    component: PageCategory,
    props: true
  },
  { name: 'Forum', path: '/forum/:forumId', component: PageForum, props: true },
  {
    name: 'Thread',
    path: '/thread/:threadId',
    component: PageThread,
    props: true,
    async beforeEnter (to, from, next) {
      await store.dispatch('fetchThread', { id: to.params.threadId })

      const threadExists = findById(store.state.threads, to.params.threadId)

      if (threadExists) {
        next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    name: 'ThreadCreate',
    path: '/forum/:forumId/thread/create',
    component: PageThreadCreate,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    name: 'ThreadEdit',
    path: '/thread/:threadId/edit',
    component: PageThreadEdit,
    props: true,
    meta: { requiresAuth: true }
  },
  { name: 'Home', path: '/', component: PageHome },
  { name: 'NotFound', path: '/:pathMatch(.*)*', component: PageNotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}

    // check of meta... property of a route is set.
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'

    return scroll
  }
})

router.beforeEach(async (to, from) => {
  store.dispatch('unsubscribeAllSnapshots') // unregister Firestore realtime updates listeners when route changes.

  await store.dispatch('initAuthentication') // ensure authId is set before checking its value.

  if (to.meta.requiresAuth && !store.state.authId) {
    return { name: 'Login', query: { redirectTo: to.path } } // unauthenticated user
  }

  if (to.meta.requiresGuest && store.state.authId) return { name: 'Home' } // authenticated user
})

export default router
