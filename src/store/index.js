import { createStore } from 'vuex'
import dataSource from '@/data.json'

export default createStore({
  state: {
    ...dataSource,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser: state => {
      const user = state.users.find(({ id }) => id === state.authId)

      if (!user) return null

      return {
        ...user,
        // 'get' acts as a property. e.g. user.posts
        get posts () { return state.posts.filter(({ userId }) => userId === user.id) },
        get postsCount () { return this.posts.length },
        get threads () { return state.threads.filter(({ userId }) => userId === user.id) },
        get threadsCount () { return this.threads.length }
      }
    }
  },
  actions: {
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    createPost (context, post) {
      post.id = 'aaaa-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.

      context.commit('setPost', { post })
      context.commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    }
  },
  mutations: {
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(({ id }) => id === userId)
      state.users[userIndex] = user
    },
    setPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(({ id }) => id === threadId)
      thread.posts.push(postId)
    }
  }
})
