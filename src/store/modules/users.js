import { findById, makeAppendChildToParentMutation } from '@/helpers'
import {
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {
    user: (state, getters, rootState) => {
      return (id) => {
        const user = findById(state.items, id)

        if (!user) return {}

        return {
          ...user,
          // 'get' acts as a property. e.g. user.posts
          get posts () {
            return rootState.posts.items.filter(
              ({ userId }) => userId === user.id
            )
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return rootState.threads.items.filter(
              ({ userId }) => userId === user.id
            )
          },
          get threadsCount () {
            return user.threads?.length || 0
          }
        }
      }
    }
  },
  actions: {
    fetchUser: ({ dispatch }, { id, handleUnsubscribe }) =>
      dispatch(
        'fetchItem',
        { resource: 'users', id, handleUnsubscribe },
        { root: true }
      ),
    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'users', ids }, { root: true }),
    createUser: async (
      { commit },
      {
        id,
        name,
        username,
        email,
        avatar = null,
        registeredAt = serverTimestamp()
      }
    ) => {
      try {
        const user = {
          id,
          name,
          username,
          usernameLower: username.toLowerCase(),
          email: email.toLowerCase(),
          avatar,
          registeredAt
        }

        // --- Firestore
        await setDoc(doc(db, 'users', id), user) // add user to Firestore with provided id/index

        // --- local store
        const newUserRef = doc(db, 'users', id)
        const newUserSnap = await getDoc(newUserRef)

        if (!newUserSnap.exists()) return {}

        const newUser = newUserSnap.data()
        commit('setItem', { resource: 'users', item: newUser }, { root: true })

        return newUser
      } catch (error) {
        return { error }
      }
    },
    updateUser: async ({ commit }, user) => {
      try {
        // write to Firestore.
        const userRef = doc(db, 'users', user.id)
        await updateDoc(userRef, user)

        // write to the store.
        commit('setItem', { resource: 'users', item: user }, { root: true })
      } catch (err) {
        console.error(err)
        return { error: err }
      }
    }
  },
  mutations: {
    appendThreadToUser: makeAppendChildToParentMutation({
      parent: 'users',
      child: 'threads'
    })
  }
}
