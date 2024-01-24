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
    createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const publishedAt = Math.floor(Date.now() / 1000) // in secs.
      const userId = state.authId
      const id = 'post-' + Math.random()
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', thread)
      commit('appendThreadToForum', { forumId, threadId: id })
      commit('appendThreadToUser', { userId, threadId: id })
      dispatch('createPost', { text, threadId: id })
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    createPost ({ commit, state }, post) {
      post.id = 'post-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000) // in secs.

      commit('setPost', { post })
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    }
  },
  mutations: {
    setThread (state, thread) {
      state.threads.push(thread)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(({ id }) => id === userId)
      state.users[userIndex] = user
    },
    setPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(({ id }) => id === threadId)
      thread.posts = thread.posts || [] // prevent error when a thread does not have posts property
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = state.forums.find(({ id }) => id === forumId)
      forum.threads = forum.threads || [] // prevent error when a forum does not have posts property
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users.find(({ id }) => id === userId)
      user.threads = user.threads || [] // prevent error when a user does not have posts property
      user.threads.push(threadId)
    }
  }
})
