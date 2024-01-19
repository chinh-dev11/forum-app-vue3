import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/components/PageHome.vue'
import PageThreadShow from '@/components/PageThreadShow.vue'
import PageNotFound from '@/components/PageNotFound.vue'
import sourceData from '@/data.json'

const routes = [
  { name: 'Home', path: '/', component: PageHome },
  {
    name: 'ThreadShow',
    path: '/thread/:id',
    component: PageThreadShow,
    props: true,
    beforeEnter (to, from, next) {
      const threadExists = sourceData.threads.find(
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
