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
    authId: null,
    unsubscribes: [],
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters,
  actions,
  mutations
})
