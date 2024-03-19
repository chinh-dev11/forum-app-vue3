import { findById, makeAppendChildToParentMutation } from '@/helpers'
import { serverTimestamp, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default {
  state: {
    items: []
  },
  getters: {
    user: (state) => {
      return (id) => {
        const user = findById(state.users.items, id)

        if (!user) return {}

        return {
          ...user,
          // 'get' acts as a property. e.g. user.posts
          get posts () {
            return state.posts.items.filter(({ userId }) => userId === user.id)
          },
          get postsCount () {
            return user.postsCount || 0
          },
          get threads () {
            return state.threads.items.filter(({ userId }) => userId === user.id)
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
      dispatch('fetchItem', { resource: 'users', id, handleUnsubscribe }),
    fetchUsers: ({ dispatch }, { ids }) =>
      dispatch('fetchItems', { resource: 'users', ids }),
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
        commit('setItem', { resource: 'users', item: newUser })

        return newUser
      } catch (error) {
        return { error }
      }
    },
    updateUser: async ({ commit }, user) => {
      console.log('user', user)
      try {
        // write to Firestore.
        const userRef = doc(db, 'users', user.id)
        await updateDoc(userRef, user)

        // write to the store.
        commit('setItem', { resource: 'users', item: user })
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
