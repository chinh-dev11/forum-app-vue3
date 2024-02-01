const findById = (resources, id) => {
  if (!resources) return null

  return resources.find(r => r.id === id)
}

const findIndexById = (resources, id) => resources.findIndex(r => r.id === id)

const filterById = (resources, id) => resources.filter(r => r.id === id)

const upSert = (resources, data) => {
  const index = resources.findIndex(({ id }) => id === data.id)

  if (index === -1) resources.push(data) // insert (data id not found in resources)
  else resources[index] = { ...resources[index], ...data } // update
}

export {
  upSert,
  filterById,
  findIndexById,
  findById
}
