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
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids })
    },
    fetchPost ({ dispatch }, { id, emoji }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji })
    },
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: '🙂' })
    },
    fetchItem ({ commit, state }, { resource, id, emoji }) {
      const db = getFirestore()

      return new Promise(resolve => {
        onSnapshot(doc(db, resource, id), (docRes) => {
          const item = { ...docRes.data(), id: docRes.id, emoji }
          commit('setItem', { resource, item })
          resolve(item)
        })
      })
    },
    fetchItems ({ dispatch }, { resource, ids, emoji }) {
      return Promise.all(ids.map((id) => dispatch('fetchItem', { resource, id, emoji })))
    },
    async updateThread ({ commit, state }, { title, text, id }) {
      const thread = findById(state.threads, id)
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
      const post = findById(state.posts, thread.posts[0])

      commit('setItem', { resource: 'threads', item: { ...thread, title } })
      commit('setItem', { resource: 'posts', item: { ...post, text } })

      return thread
    },
    async createThread ({ commit, state, dispatch }, { title, text, forumId }) {
      const publishedAt = Math.floor(Date.now() / 1000) // in secs.
      const userId = state.authId
      const id = 'thread-' + Math.random()
      const thread = { forumId, title, publishedAt, userId, id }

      commit('setItem', { resource: 'threads', item: thread })
      commit('appendThreadToForum', { parentId: forumId, childId: thread.id })
      commit('appendThreadToUser', { parentId: userId, childId: thread.id })
      dispatch('createPost', { text, threadId: thread.id })

      return findById(state.threads, thread.id)
    },
    createPost ({ commit, state }, post) {
      post.id = 'post-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000) // in secs.

      commit('setItem', { resource: 'posts', item: post })
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
      commit('setItem', { resource: 'users', item: user })
    }
  },
  mutations: {
    setItem (state, { resource, item }) {
      upSert(state[resource], item)
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
    })
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
