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

export {
  flatFilterValues,
  upSert,
  filterById,
  findIndexById,
  findById
}
