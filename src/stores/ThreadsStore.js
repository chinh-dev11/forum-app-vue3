import { defineStore } from 'pinia'
import dataSource from '@/data.json'

export const useThreadsStore = defineStore('ThreadsStore', {
  state: () => ({
    threads: dataSource.threads
  }),
  getters: {},
  actions: {}
})
