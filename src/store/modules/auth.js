import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth, db } from '@/firebase'
import {
  query,
  collection,
  where,
  getDocs,
  orderBy,
  startAfter,
  limit
} from 'firebase/firestore'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication: ({ dispatch, commit, state }) => {
      if (state.authObserverUnsubscribe) state.authObserverUnsubscribe() // unsubscribe auth observer before setting new one, hence preventing to have multiple auth observers since auth observer is subscribed on every route change.

      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) await dispatch('fetchAuthUser')
          else dispatch('unsubscribeAuthUserSnapshot') // unsubscribe authenticated user Firebase realtime updates listener when sign out.

          resolve(user)
        })

        commit('setAuthObserverUnsubscribe', unsubscribe) // keep unsubscribe function reference, to be called to unsubscribe auth observer.
      })
    },
    // ------ Fetch single resource.
    fetchAuthUser: async ({ dispatch, commit }) => {
      try {
        const userId = auth.currentUser?.uid || null // get the Firebase authentication current auth user id
        commit('setAuthId', userId)

        if (!userId) {
          // no user authenticated: need to do something?
          return null
        }

        const handleUnsubscribe = (unsubscribe) =>
          commit('setAuthUserUnsubscribe', unsubscribe)
        const user = await dispatch(
          'users/fetchUser',
          {
            id: userId,
            handleUnsubscribe
          },
          { root: true }
        )

        return { id: user.id }
      } catch (error) {
        return { error }
      }
    },
    fetchAuthUserPosts: async ({ commit, state }, { lastPostFetched }) => {
      try {
        const queryParams = [
          collection(db, 'posts'),
          where('userId', '==', state.authId),
          orderBy('publishedAt', 'desc'),
          limit(10)
        ]
        /*
        Pagination
        - compound query requires indexes.
        - if no indexes created, an error with a link to the Firestore Database for the creation, in the DevTools console. Or can be created manually at https://console.firebase.google.com/project/forum-app-vue3/firestore/databases/-default-/indexes
        */
        if (lastPostFetched) queryParams.push(startAfter(lastPostFetched.publishedAt))

        const q = query(...queryParams)
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map((doc) => {
          const docData = doc.data()
          const item = {
            ...docData,
            id: doc.id,
            publishedAt: docData.publishedAt
          }

          commit('setItem', { resource: 'posts', item }, { root: true })

          return item
        })
      } catch (err) {
        console.error(err)
        return { error: err }
      }
    },
    // Firebase Authentication - with Google provider
    signInUserWithGoogle: async ({ dispatch }) => {
      try {
        const provider = new GoogleAuthProvider()
        const { user } = await signInWithPopup(auth, provider)

        const newUser = {
          id: user.uid,
          name: user.displayName,
          username: user.email,
          email: user.email,
          avatar: user.photoURL,
          registeredAt: user.metadata.createdAt
        }

        return await dispatch('users/createUser', newUser, { root: true })
      } catch (error) {
        return { error }
      }
    },
    // Firebase Authentication
    signInUser: async ({ dispatch }, { email, password }) => {
      try {
        return await signInWithEmailAndPassword(auth, email, password)
      } catch (error) {
        return { error }
      }
    },
    // Firebase Authentication
    signOutUser: async ({ commit }) => {
      try {
        await signOut(auth)

        commit('setAuthId', null)
      } catch (error) {
        console.error(error)
      }
    },
    // Firebase Authentication
    registerUserWithEmailAndPassword: async ({ dispatch }, user) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        )
        const userCredentialUid = userCredential.user?.uid

        if (!userCredentialUid) return null

        user.id = userCredentialUid

        return await dispatch('users/createUser', user, { root: true }) // add user to Firestore and local store
      } catch (error) {
        return { error }
      }
    },
    // ------ Memory leaks, performance issues.
    // unsubscribe Firestore realtime updates listeners (onSnapshot).
    // authenticate user Firebase realtime updates subscription
    unsubscribeAuthUserSnapshot: async ({ commit, state }) => {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId: (state, id) => {
      state.authId = id
    },
    setAuthUserUnsubscribe: (state, unsubscribe) => {
      state.authUserUnsubscribe = unsubscribe
    },
    setAuthObserverUnsubscribe: (state, unsubscribe) => {
      state.authObserverUnsubscribe = unsubscribe
    }
  }
}
