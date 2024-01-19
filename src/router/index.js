import { createRouter, createWebHistory } from 'vue-router'
import PageHome from '@/components/PageHome.vue'
import PageThreadShow from '@/components/PageThreadShow.vue'
import PageNotFound from '@/components/PageNotFound.vue'

const routes = [
  { name: 'Home', path: '/', component: PageHome },
  { name: 'ThreadShow', path: '/thread/:id', component: PageThreadShow, props: true },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
