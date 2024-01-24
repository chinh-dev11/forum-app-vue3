import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import PageThreadShow from '@/views/PageThreadShow.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import dataSource from '@/data.json'
import PageForum from '@/views/PageForum.vue'
import PageCategory from '@/views/PageCategory.vue'
import PageProfile from '@/views/PageProfile.vue'
import PageThreadCreate from '@/views/PageThreadCreate.vue'

const routes = [
  { name: 'Home', path: '/', component: PageHome },
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
    path: '/category/:id',
    component: PageCategory,
    props: true
  },
  { name: 'Forum', path: '/forum/:id', component: PageForum, props: true },
  {
    name: 'ThreadShow',
    path: '/thread/:id',
    component: PageThreadShow,
    props: true,
    beforeEnter (to, from, next) {
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
    }
  },
  {
    name: 'ThreadCreate',
    path: '/forum/:forumId/thread/create',
    component: PageThreadCreate,
    props: true
  },
  { name: 'NotFound', path: '/:pathMatch(.*)*', component: PageNotFound }
]

export default createRouter({
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
