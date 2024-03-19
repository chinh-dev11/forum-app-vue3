import { serverTimestamp, doc, updateDoc, getDoc, collection, addDoc, arrayUnion, increment } from 'firebase/firestore'
import { db } from '@/firebase'
import { docToResource } from '@/helpers'

export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchPost: ({ dispatch }, { id, emoji }) =>
      dispatch('fetchItem', { resource: 'posts', id, emoji }),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'posts', ids, emoji: '🙂' }),
    updatePost: async ({ commit, state }, { id, text }) => {
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

        // update local store
        const updatedPost = await getDoc(postRef)
        commit('setItem', {
          resource: 'posts',
          item: docToResource(updatedPost)
        })
      } catch (error) {
        return { error }
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

        // --- local store
        const postDoc = (await getDoc(newPostRef)).data() // to store same data to local store as in Firestore (i.e. timestamp).
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
      } catch (error) {
        return { error }
      }
    }
  },
  mutations: {}
}
