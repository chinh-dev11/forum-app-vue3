import { createStore } from 'vuex'
import dataSource from '@/data.json'
import { findById, findIndexById, filterById, upSert } from '@/helpers'

export default createStore({
  state: {
    ...dataSource,
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser: (state) => {
      const user = findById(state.users, state.authId)

      if (!user) return null

      return {
        ...user,
        // 'get' acts as a property. e.g. user.posts
        get posts () {
          return filterById(state.posts, user.id)
        },
        get postsCount () {
          return this.posts.length
        },
        get threads () {
          return filterById(state.threads, user.id)
        },
        get threadsCount () {
          return this.threads.length
        }
      }
    },
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id)

        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1 // -1 since 1st post is of the thread and not a reply.
          },
          get contributorsCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
      const post = findById(state.posts, thread.posts[0])

      commit('setThread', { ...thread, title })
      commit('setPost', { ...post, text })

      return thread
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const publishedAt = Math.floor(Date.now() / 1000) // in secs.
      const userId = state.authId
      const id = 'thread-' + Math.random()
      const thread = { forumId, title, publishedAt, userId, id }

      commit('setThread', thread)
      commit('appendThreadToForum', { parentId: forumId, childId: thread.id })
      commit('appendThreadToUser', { parentId: userId, childId: thread.id })
      dispatch('createPost', { text, threadId: thread.id })

      return findById(state.threads, thread.id)
    },
    createPost ({ commit, state }, post) {
      post.id = 'post-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000) // in secs.

      commit('setPost', post)
      commit('appendPostToThread', {
        childId: post.id,
        parentId: post.threadId
      })
      commit('appendContributorToThread', {
        childId: state.authId,
        parentId: post.threadId
      })
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  mutations: {
    setThread (state, thread) {
      upSert(state.threads, thread)
    },
    setPost (state, post) {
      upSert(state.posts, post)
    },
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    }),
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads'
    }),
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    }),
    setUser (state, { user, userId }) {
      const index = findIndexById(state.users, userId)
      state.users[index] = user
    }
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    // adding id to the resource only if the id is not already in the array.
    if (!resource[child].includes(childId)) resource[child].push(childId)
  }
}
