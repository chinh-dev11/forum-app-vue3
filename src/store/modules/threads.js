import {
  findById,
  docToResource,
  makeAppendChildToParentMutation
} from '@/helpers'
import {
  doc,
  writeBatch,
  serverTimestamp,
  collection,
  arrayUnion,
  getDoc
} from 'firebase/firestore'
import { db } from '@/firebase'
import chunk from 'lodash/chunk'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id)

        if (!thread) return {}

        return {
          ...thread,
          get author () {
            return findById(rootState.users.items, thread.userId)
          },
          get repliesCount () {
            return thread.posts?.length - 1 || 0 // -1: since the 1st post is not of a reply but an inital post of the thread.
          },
          get contributorsCount () {
            return thread.contributors?.length || 0
          }
        }
      }
    }
  },
  actions: {
    fetchThread: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'threads', id }, { root: true }),
    fetchThreads: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'threads', ids }, { root: true }),
    fetchThreadsByPage: ({ dispatch, commit }, { ids, page, perPage = 10 }) => {
      commit('clearThreads')

      const chunks = chunk(ids, perPage)
      const limitedIds = chunks[page - 1]
      return dispatch('fetchThreads', { ids: limitedIds })
    },
    updateThread: async (
      { state, getters, rootState },
      { title, text, id }
    ) => {
      try {
        const { id: threadId, posts: threadPosts } = findById(state.items, id)
        // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
        const { id: postId } = findById(rootState.posts.items, threadPosts[0])

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

        return threadRef
      } catch (error) {
        return { error }
      }
    },
    createThread: async (
      { commit, state, dispatch, rootState },
      { forumId, text, title }
    ) => {
      try {
        const userId = rootState.auth.authId

        if (!userId) return { error: 'Authentication required.' }

        const publishedAt = serverTimestamp()
        const thread = { forumId, publishedAt, title, userId }

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

        // --- local store
        commit(
          'forums/appendThreadToForum',
          {
            parentId: forumId,
            childId: newThreadRef.id
          },
          { root: true }
        )
        commit(
          'users/appendThreadToUser',
          {
            parentId: userId,
            childId: newThreadRef.id
          },
          { root: true }
        )

        // to store same data to local store as in Firestore (i.e. timestamp).
        const threadDoc = await getDoc(newThreadRef)
        commit(
          'setItem',
          {
            resource: 'threads',
            item: docToResource(threadDoc)
          },
          { root: true }
        )

        const post = { text, threadId: newThreadRef.id }
        await dispatch('posts/createPost', { post }, { root: true }) // add the initial post of the new thread to posts.

        return findById(state.items, newThreadRef.id)
      } catch (error) {
        return { error }
      }
    }
  },
  mutations: {
    appendContributorToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'contributors'
    }),
    appendPostToThread: makeAppendChildToParentMutation({
      parent: 'threads',
      child: 'posts'
    }),
    clearThreads (state) {
      state.items = []
    }
  }
}
