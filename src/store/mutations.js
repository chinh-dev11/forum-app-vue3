import { upSert } from '@/helpers'

export default {
  setItem: (state, { resource, item }) => upSert(state[resource], item),
  setItems: (state, { resource, items }) => items.forEach(item => { upSert(state[resource], item) }),
  appendUnsubscribe: (state, { unsubscribe }) => { state.unsubscribes.push(unsubscribe) },
  clearAllSnapshots: (state) => { state.unsubscribes = [] }
}
