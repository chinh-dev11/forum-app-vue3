export default {
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'categories', id }),
    fetchAllCategories: ({ dispatch }) =>
      dispatch('fetchAll', { resource: 'categories' })
  },
  mutations: {}
}
