import { defineStore } from 'pinia'
import dataSource from '@/data.json'

export const useCategoriesStore = defineStore('CategoriesStore', {
  state: () => ({
    categories: dataSource.categories
  }),
  getters: {

  },
  actions: {

  }
})
