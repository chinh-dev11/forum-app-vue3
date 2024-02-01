import { createStore } from 'vuex'
import { findById, upSert } from '@/helpers'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'

export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'ALXhxjwgY9PinwNGHpfai6OWyDu2'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: (state) => {
      return (id) => {
        const user = findById(state.users, id)

        if (!user) return {}

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
    thread: (state) => {
      return (id) => {
        const thread = findById(state.threads, id)

        if (!thread) return {}

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
    async fetchThread ({ commit, state }, { id }) {
      const db = getFirestore()

      return new Promise(resolve => {
        onSnapshot(doc(db, 'threads', id), (docThread) => {
          const thread = { ...docThread.data(), id: docThread.id }
          commit('setThread', { thread })
          resolve(thread)
        })
      })
    },
    async fetchUser ({ commit, state }, { id }) {
      const db = getFirestore()

      return new Promise(resolve => {
        onSnapshot(doc(db, 'users', id), (docUser) => {
          const user = { ...docUser.data(), id: docUser.id }
          commit('setUser', { user })
          resolve(user)
        })
      })
    },
    async fetchPost ({ commit, state }, { id }) {
      const db = getFirestore()

      return new Promise(resolve => {
        onSnapshot(doc(db, 'posts', id), (docPost) => {
          const post = { ...docPost.data(), id: docPost.id }
          commit('setPost', { post })
          resolve(post)
        })
      })
    },
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
      commit('setUser', { user })
    }
  },
  mutations: {
    setThread (state, { thread }) {
      upSert(state.threads, thread)
    },
    setPost (state, { post }) {
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
    setUser (state, { user }) {
      upSert(state.users, user)
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
