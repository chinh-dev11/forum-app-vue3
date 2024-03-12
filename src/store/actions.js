import { docToResource, findById } from '@/helpers'

// --- Firebase ---
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc, // Firestore auto-generated id
  setDoc, // must provide an id
  updateDoc,
  arrayUnion,
  serverTimestamp,
  writeBatch,
  increment,
  onSnapshot
} from 'firebase/firestore'
import firebaseConfig from '@/config/firebase'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth'

// Initialize Firebase.
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service.
const db = getFirestore(app)

const auth = getAuth()

export default {
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
      const user = await dispatch('fetchUser', {
        id: userId,
        handleUnsubscribe
      })

      return { id: user.id }
    } catch (error) {
      return { error }
    }
  },
  fetchCategory: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'categories', id }),
  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id }),
  fetchThread: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'threads', id }),
  fetchUser: ({ dispatch }, { id, handleUnsubscribe }) =>
    dispatch('fetchItem', { resource: 'users', id, handleUnsubscribe }),
  fetchPost: ({ dispatch }, { id, emoji }) =>
    dispatch('fetchItem', { resource: 'posts', id, emoji }),
  // fetch the resource and subscribe for realtime updates
  fetchItem: ({ commit }, { resource, id, handleUnsubscribe = null }) => {
    return new Promise((resolve, reject) => {
      // using upgrade Firestore modular API.
      const resourceRef = doc(db, resource, id) // id: key of the doc. e.g. for user: key is the user id.
      // Firestore realtime updates listener
      const unsubscribe = onSnapshot(
        resourceRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const item = docToResource(snapshot)
            commit('setItem', { resource, item }) // update local store state.

            resolve(item)
          } else {
            resolve(null)
          }
        },
        (err) => {
          reject(err)
        }
      )

      // register Firestore realtime updates subscriptions to the store.
      // to be used to unsubscribe listeners on route change.
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe) // subscription of authenticated user.
      } else {
        commit('appendUnsubscribe', { unsubscribe }) // all other subscriptions.
      }
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
  // fetch resources without listener for real-time updates
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
    try {
      const { id: threadId, posts: threadPosts } = findById(state.threads, id)
      // the 1st post, at index [0], is created when the thread was first created. Hence using its value as id to find the post to update.
      const { id: postId } = findById(state.posts, threadPosts[0])

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
    { commit, state, dispatch },
    { forumId, text, title }
  ) => {
    try {
      const publishedAt = serverTimestamp()
      const userId = state.authId
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
      commit('appendThreadToForum', {
        parentId: forumId,
        childId: newThreadRef.id
      })
      commit('appendThreadToUser', {
        parentId: userId,
        childId: newThreadRef.id
      })

      // to store same data to local store as in Firestore (i.e. timestamp).
      const threadDoc = await getDoc(newThreadRef)
      commit('setItem', {
        resource: 'threads',
        item: docToResource(threadDoc)
      })

      const post = { text, threadId: newThreadRef.id }
      await dispatch('createPost', { post }) // add the initial post of the new thread to posts.

      return findById(state.threads, newThreadRef.id)
    } catch (error) {
      return { error }
    }
  },
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

      return await dispatch('createUser', newUser)
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

      return await dispatch('createUser', user) // add user to Firestore and local store
    } catch (error) {
      return { error }
    }
  },
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
  updateUser: ({ commit }, user) =>
    commit('setItem', { resource: 'users', item: user }),

  // ------ Memory leaks, performance issues.
  // unsubscribe Firestore realtime updates listeners (onSnapshot).
  // authenticate user Firebase realtime updates subscription
  unsubscribeAuthUserSnapshot: async ({ commit, state }) => {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe()
      commit('setAuthUserUnsubscribe', null)
    }
  },
  // all other subscriptions: forums, threads, other users,...
  unsubscribeAllSnapshots: async ({ commit, state }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllSnapshots')
  }
}
