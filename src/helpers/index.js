const findById = (resources, id) => {
  return resources.find(r => r.id === id)
}

const findIndexById = (resources, id) => {
  return resources.findIndex(r => r.id === id)
}

const filterById = (resources, id) => {
  return resources.filter(r => r.id === id)
}

const upSert = (resources, data) => {
  const index = resources.findIndex(({ id }) => id === data.id)

  if (index === -1) resources.push(data) // insert (data id not found in resources)
  else resources[index] = { ...resources[index], ...data } // update
}

// flatten array and filter out any duplicates, null, empty, undefined values.
const flatFilterValues = (values) => {
  return [...new Set(values.flat().filter(value => value))]
}

const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') return doc

  return { ...doc.data(), id: doc.id }
}

const makeAppendChildToParentMutation = ({ parent, child }) => {
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

export {
  makeAppendChildToParentMutation,
  docToResource,
  flatFilterValues,
  upSert,
  filterById,
  findIndexById,
  findById
}
