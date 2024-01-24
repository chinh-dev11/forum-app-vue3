import { createStore } from 'vuex'
import dataSource from '@/data.json'

export default createStore({
  state: {
    ...dataSource,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser: (state) => {
      const user = state.users.find(({ id }) => id === state.authId)

      if (!user) return null

      return {
        ...user,
        // 'get' acts as a property. e.g. user.posts
        get posts () {
          return state.posts.filter(({ userId }) => userId === user.id)
        },
        get postsCount () {
          return this.posts.length
        },
        get threads () {
          return state.threads.filter(({ userId }) => userId === user.id)
        },
        get threadsCount () {
          return this.threads.length
        }
      }
    }
  },
  actions: {
    async updateThread ({ commit, state, dispatch }, { title, text, id }) {
      const thread = state.threads.find((t) => t.id === id)
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
      const post = state.posts.find((p) => p.id === thread.posts[0])

      commit('modifyThread', { ...thread, title })
      commit('modifyPost', { ...post, text, threadId: thread.id })

      return thread
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const publishedAt = Math.floor(Date.now() / 1000) // in secs.
      const userId = state.authId
      const id = 'post-' + Math.random()
      const thread = { forumId, title, publishedAt, userId, id }
      commit('setThread', thread)
      commit('appendThreadToForum', { forumId, threadId: id })
      commit('appendThreadToUser', { userId, threadId: id })
      dispatch('createPost', { text, threadId: id })

      return state.threads.find(({ id }) => id === thread.id)
    },
    createPost ({ commit, state }, post) {
      post.id = 'post-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000) // in secs.

      commit('setPost', { post })
      commit('appendPostToThread', {
        postId: post.id,
        threadId: post.threadId
      })
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  mutations: {
    setThread (state, thread) {
      state.threads.push(thread)
    },
    modifyThread (state, thread) {
      const index = state.threads.findIndex((t) => t.id === thread.id)
      state.threads[index] = thread
    },
    setPost (state, { post }) {
      state.posts.push(post)
    },
    modifyPost (state, post) {
      const index = state.posts.findIndex(
        (p) => p.threadId === post.threadId
      )
      state.posts[index] = post
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
    },
    setUser (state, { user, userId }) {
      const index = state.users.findIndex(({ id }) => id === userId)
      state.users[index] = user
    }
  }
})
