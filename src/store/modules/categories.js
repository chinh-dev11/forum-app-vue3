export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) =>
      dispatch('fetchItem', { resource: 'categories', id }, { root: true }),
    fetchAllCategories: ({ dispatch }) =>
      dispatch('fetchAll', { resource: 'categories' }, { root: true })
  },
  mutations: {}
}
