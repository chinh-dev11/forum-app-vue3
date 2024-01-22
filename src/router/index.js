import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/views/PageHome.vue'
import PageThreadShow from '@/views/PageThreadShow.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import dataSource from '@/data.json'
import PageForum from '@/views/PageForum.vue'
import PageCategory from '@/views/PageCategory.vue'

const routes = [
  { name: 'Home', path: '/', component: PageHome },
  { name: 'Category', path: '/category/:id', component: PageCategory, props: true },
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
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
