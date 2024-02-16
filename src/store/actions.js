import { docToResource, findById } from '@/helpers'

// --- Firebase ---
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
  increment,
  onSnapshot
} from 'firebase/firestore'
import firebaseConfig from '@/config/firebase'

// Initialize Firebase.
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service.
const db = getFirestore(app)

export default {
  // ------ Fetch single resource.
  fetchAuthUser: ({ dispatch, state }) =>
    dispatch('fetchUser', { id: state.authId }),
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'threads', id }),
  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id }),
  fetchPost: ({ dispatch }, { id, emoji }) =>
    dispatch('fetchItem', { resource: 'posts', id, emoji }),
  fetchItem: async ({ commit }, { resource, id, emoji }) => {
    if (!id) return {}

    return new Promise((resolve, reject) => {
      // using upgrade Firestore modular API.
      const resourceRef = doc(db, resource, id) // id: key of the doc. e.g. for user: key is the user id.

      const unsubscribe = onSnapshot(resourceRef,
        (snapshot) => {
          if (!snapshot.exists()) return {}

          const item = docToResource(snapshot)

          // update local store state.
          commit('setItem', { resource, item })

          resolve(item)
        },
        (err) => {
          console.error(err)
          reject(err)
        })

      commit('appendUnsubscribe', { unsubscribe }) // for cleanup listeners when route changes.
    })
  },

  // ------ Fetch multiple resources.
  fetchAllCategories: ({ dispatch }) =>
    dispatch('fetchAll', { resource: 'categories' }),
  fetchForums: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'forums', ids }),
  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'threads', ids }),
  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'users', ids }),
  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'posts', ids, emoji: '🙂' }),
  fetchItems: ({ dispatch }, { resource, ids, emoji }) => {
    if (!ids) return []

    return Promise.all(
      ids.map((id) => dispatch('fetchItem', { resource, id, emoji }))
    )
  },
  fetchAll: async ({ commit }, { resource }) => {
    // using upgrade Firestore modular API
    const resourceRef = collection(db, resource)
    const docSnap = await getDocs(resourceRef)

    if (docSnap.empty) return []

    const all = docSnap.docs.map((doc) => docToResource(doc))

    commit('setItems', { resource, items: all })

    return all
  },

  // ------ Create/Update resource.
  updateThread: async ({ state }, { title, text, id }) => {
    const { id: threadId, posts: threadPosts } = findById(state.threads, id)
    // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
    const { id: postId } = findById(state.posts, threadPosts[0])

    try {
      // --- Firestore
      const threadRef = doc(db, 'threads', threadId)
      const postRef = doc(db, 'posts', postId)

      await writeBatch(db)
        .update(threadRef, {
          title
        })
        .update(postRef, {
          text
        })
        .commit()

      return threadId
    } catch (err) {
      console.error(err)
    }
  },
  createThread: async (
    { commit, state, dispatch },
    { forumId, text, title }
  ) => {
    const publishedAt = serverTimestamp()
    const userId = state.authId
    const thread = { forumId, publishedAt, title, userId }

    try {
      // --- Firestore
      // chaninable batch.
      const newThreadRef = doc(collection(db, 'threads'))
      const forumRef = doc(db, 'forums', forumId)
      const userRef = doc(db, 'users', userId)

      await writeBatch(db)
        .set(newThreadRef, thread) // add new thread to threads.
        .update(forumRef, {
          threads: arrayUnion(newThreadRef.id) // append the new thread id to the forum.
        })
        .update(userRef, {
          threads: arrayUnion(newThreadRef.id) // append the new thread id to the user.
        })
        .commit()

      // --- local state
      commit('appendThreadToForum', {
        parentId: forumId,
        childId: newThreadRef.id
      })
      commit('appendThreadToUser', {
        parentId: userId,
        childId: newThreadRef.id
      })

      // to store same data to local state as in Firestore (i.e. timestamp).
      const threadDoc = await getDoc(newThreadRef)
      commit('setItem', {
        resource: 'threads',
        item: docToResource(threadDoc)
      })

      const post = { text, threadId: newThreadRef.id }
      await dispatch('createPost', { post }) // add the initial post of the new thread to posts.

      return findById(state.threads, newThreadRef.id)
    } catch (err) {
      console.error(err)
    }
  },
  updatePost: async ({ dispatch, commit, state }, { id, text }) => {
    try {
      const post = {
        text,
        edited: {
          at: serverTimestamp(),
          by: state.authId,
          moderated: false
        }
      }

      // update Firestore
      const postRef = doc(db, 'posts', id)
      await updateDoc(postRef, {
        ...post
      })

      // update local state
      const updatedPost = await getDoc(postRef)
      commit('setItem', { resource: 'posts', item: docToResource(updatedPost) })

      // return true
    } catch (err) {
      console.error(err)
    }
  },
  createPost: async ({ dispatch, commit, state }, { post }) => {
    // TODO: postsCount is randomly reset to 1 (async issue???)
    try {
      post.userId = state.authId
      post.publishedAt = serverTimestamp()

      // --- Firestore
      const postsRef = collection(db, 'posts')
      const newPostRef = await addDoc(postsRef, post) // add the new post to posts.

      const threadRef = doc(db, 'threads', post.threadId)
      updateDoc(threadRef, {
        posts: arrayUnion(newPostRef.id), // append the new post id to the thread posts.
        contributors: arrayUnion(post.userId) // append the user id to the thread contributors.
      })

      const userRef = doc(db, 'users', post.userId)
      updateDoc(userRef, {
        postsCount: increment(1) // increment at every post creation
      })

      // --- local state
      const postDoc = (await getDoc(newPostRef)).data() // to store same data to local state as in Firestore (i.e. timestamp).
      commit('setItem', {
        resource: 'posts',
        item: { ...postDoc, id: newPostRef.id }
      })
      commit('appendPostToThread', {
        childId: newPostRef.id,
        parentId: postDoc.threadId
      })
      commit('appendContributorToThread', {
        childId: postDoc.userId,
        parentId: postDoc.threadId
      })

      dispatch('fetchItem', { resource: 'users', id: userRef.id }) // fetch the post's user to get the new postsCount.
    } catch (err) {
      console.error(err)
    }
  },
  updateUser: ({ commit }, user) =>
    commit('setItem', { resource: 'users', item: user }),

  // ------ Memory leaks, performance issues.
  // unregister Firestore realtime updates listeners (onSnapshot).
  unsubscribeAllSnapshots: async ({ commit, state }) => {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllSnapshots')
  }
}
