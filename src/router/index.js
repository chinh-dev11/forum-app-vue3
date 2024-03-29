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

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: UserLogin
  },
  {
    name: 'Register',
    path: '/register',
    component: UserRegister
  },
  {
    name: 'ProfileEdit',
    path: '/me/edit',
    component: PageProfile,
    props: { edit: true } // pass in 'edit' prop as boolean type (true/false).
  },
  {
    name: 'Profile',
    path: '/me',
    component: PageProfile,
    meta: { toTop: true, smothScroll: true } // scroll top smoothly. e.g. in case when editing profile.
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
    props: true
    // TODO: find a better solution of route guarding
    /* beforeEnter (to, from, next) {
      const threadExists = dataSource.threads.find(
        (t) => t.id === to.params.id
      )

      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    } */
  },
  {
    name: 'ThreadCreate',
    path: '/forum/:forumId/thread/create',
    component: PageThreadCreate,
    props: true
  },
  {
    name: 'ThreadEdit',
    path: '/thread/:threadId/edit',
    component: PageThreadEdit,
    props: true
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

router.beforeEach(() => {
  store.dispatch('unsubscribeAllSnapshots') // unregister Firestore realtime updates listeners when route changes.
})

export default router
