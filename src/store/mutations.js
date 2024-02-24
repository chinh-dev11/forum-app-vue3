import { upSert, findById } from '@/helpers'

export default {
  setAuthId: (state, id) => { state.authId = id },
  setAuthUserUnsubscribe: (state, unsubscribe) => { state.authUserUnsubscribe = unsubscribe },
  setItem: (state, { resource, item }) => upSert(state[resource], item),
  setItems: (state, { resource, items }) => items.forEach(item => { upSert(state[resource], item) }),
  appendUnsubscribe: (state, { unsubscribe }) => { state.unsubscribes.push(unsubscribe) },
  clearAllSnapshots: (state) => { state.unsubscribes = [] },
  appendContributorToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'contributors'
  }),
  appendPostToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'posts'
  }),
  appendThreadToForum: makeAppendChildToParentMutation({
    parent: 'forums',
    child: 'threads'
  }),
  appendThreadToUser: makeAppendChildToParentMutation({
    parent: 'users',
    child: 'threads'
  })
}

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)

    if (!resource) {
      console.warn(`Append child:${child}:${childId} to parent:${parent}:${parentId} failed because the parent:${parent} didin't exist`)
      return
    }

    resource[child] = resource[child] || []

    // adding id to the resource only if the id is not already in the array.
    if (!resource[child].includes(childId)) resource[child].push(childId)
  }
}
