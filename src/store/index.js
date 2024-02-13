import { createStore } from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters,
  actions,
  mutations
})
