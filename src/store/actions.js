import { findById } from '@/helpers'

// --- Firebase ---
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore'
import firebaseConfig from '@/config/firebase'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app)

export default {
  // ------ Fetch single resource
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id }),
  fetchPost: ({ dispatch }, { id, emoji }) => dispatch('fetchItem', { resource: 'posts', id, emoji }),
  fetchItem: async ({ commit }, { resource, id, emoji }) => {
    if (!id) return {}

    // using upgrade Firestore modular API
    const docRef = doc(db, resource, id) // id: key of the doc. e.g. for user: key is the user id.
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return {}

    const item = { ...docSnap.data(), id: docSnap.id }

    commit('setItem', { resource, item })

    return item
  },

  // ------ Fetch multiple resources
  fetchAllCategories: ({ dispatch }) => dispatch('fetchAll', { resource: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '🙂' }),
  fetchItems: ({ dispatch }, { resource, ids, emoji }) => {
    if (!ids) return []

    return Promise.all(ids.map((id) => dispatch('fetchItem', { resource, id, emoji })))
  },
  fetchAll: async ({ commit }, { resource }) => {
    // using upgrade Firestore modular API
    const docRef = collection(db, resource)
    const docSnap = await getDocs(docRef)

    if (docSnap.empty) return []

    const all = docSnap.docs.map(doc => ({ ...doc.data(), id: doc.id }))

    commit('setItems', { resource, items: all })

    return all
  },

  // ------ Create/Update resource
  updateThread: async ({ commit, state }, { title, text, id }) => {
    const thread = findById(state.threads, id)
    // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
    const post = findById(state.posts, thread.posts[0])

    commit('setItem', { resource: 'threads', item: { ...thread, title } })
    commit('setItem', { resource: 'posts', item: { ...post, text } })

    return thread
  },
  createThread: async ({ commit, state, dispatch }, { title, text, forumId }) => {
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
  createPost: ({ commit, state }, post) => {
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
  updateUser: ({ commit }, user) => commit('setItem', { resource: 'users', item: user })
}
