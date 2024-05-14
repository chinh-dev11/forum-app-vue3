import { doc, onSnapshot, collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { docToResource, findById } from '@/helpers'

export default {
  // fetch the resource and subscribe for realtime updates
  fetchItem: ({ state, commit }, { resource, id, handleUnsubscribe = null, once = false, cbOnSnapshot = null }) => {
    return new Promise((resolve, reject) => {
      // using upgrade Firestore modular API.
      const resourceRef = doc(db, resource, id) // id: key of the doc. e.g. for user: key is the user id.
      // Firestore realtime updates listener
      const unsubscribe = onSnapshot(
        resourceRef,
        (snapshot) => {
          if (once) {
            unsubscribe()
          }

          if (snapshot.exists()) {
            const item = docToResource(snapshot)

            let previousItem = findById(state[resource].items, id)
            previousItem = previousItem ? { ...previousItem } : null

            commit('setItem', { resource, item }) // update local store state.

            if (typeof cbOnSnapshot === 'function') {
              const isLocal = snapshot.metadata.hasPendingWrites
              cbOnSnapshot({ item: { ...item }, previousItem, isLocal })
            }

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
  fetchItems: ({ dispatch }, { resource, ids, emoji, cbOnSnapshot = null }) => {
    if (!ids) return []

    return Promise.all(
      ids.map((id) => dispatch('fetchItem', { resource, id, emoji, cbOnSnapshot }))
    )
  },
  // fetch resources without listener for real-time updates
  fetchAll: async ({ commit }, { resource }) => {
    // using upgrade Firestore modular API
    const resourceRef = collection(db, resource)
    const docSnap = await getDocs(resourceRef)

    if (docSnap.empty) return []

    const all = docSnap.docs.map((doc) => docToResource(doc)) // read from Firestore.

    commit('setItems', { resource, items: all }) // write to the store.

    return all
  },
  // ------ Memory leaks, performance issues.
  // all other subscriptions: forums, threads, other users,...
  unsubscribeAllSnapshots: async ({ commit, state }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe())
    commit('clearAllSnapshots')
  }
}
