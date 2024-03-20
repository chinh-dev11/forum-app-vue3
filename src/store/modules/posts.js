import {
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  arrayUnion,
  increment
} from 'firebase/firestore'
import { db } from '@/firebase'
import { docToResource } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchPost: ({ dispatch }, { id, emoji }) =>
      dispatch('fetchItem', { resource: 'posts', id, emoji }, { root: true }),
    fetchPosts: ({ dispatch }, { ids }) =>
      dispatch(
        'fetchItems',
        { resource: 'posts', ids, emoji: '🙂' },
        { root: true }
      ),
    updatePost: async ({ commit, state, rootState }, { id, text }) => {
      try {
        const post = {
          text,
          edited: {
            at: serverTimestamp(),
            by: rootState.auth.authId,
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
        commit(
          'setItem',
          {
            resource: 'posts',
            item: docToResource(updatedPost)
          },
          { root: true }
        )
      } catch (error) {
        return { error }
      }
    },
    createPost: async ({ dispatch, commit, state, rootState }, { post }) => {
      // TODO: postsCount is randomly reset to 1 (async issue???)
      try {
        post.userId = rootState.auth.authId
        post.publishedAt = serverTimestamp()

        // --- Firestore
        const postsRef = collection(db, 'posts')
        const newPostRef = await addDoc(postsRef, post) // add the new post to posts.

        const threadRef = doc(db, 'threads', post.threadId)
        updateDoc(threadRef, {
          posts: arrayUnion(newPostRef.id), // append the new post id to the thread posts.
          contributors: arrayUnion(post.userId) // append the user id to the thread contributors.
        })

        const userRef = doc(db, 'users', rootState.auth.authId)
        updateDoc(userRef, {
          postsCount: increment(1) // increment at every post creation
        })

        // --- local store
        const postDoc = (await getDoc(newPostRef)).data() // to store same data to local store as in Firestore (i.e. timestamp).
        commit(
          'setItem',
          {
            resource: 'posts',
            item: { ...postDoc, id: newPostRef.id }
          },
          { root: true }
        )
        commit(
          'threads/appendPostToThread',
          {
            childId: newPostRef.id,
            parentId: postDoc.threadId
          },
          { root: true }
        )
        commit(
          'threads/appendContributorToThread',
          {
            childId: postDoc.userId,
            parentId: postDoc.threadId
          },
          { root: true }
        )
      } catch (error) {
        return { error }
      }
    }
  },
  mutations: {}
}
