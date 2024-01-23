import { defineStore } from 'pinia'
import dataSource from '@/data.json'
import { useThreadsStore } from '@/stores/ThreadsStore'

export const usePostsStore = defineStore('PostsStore', {
  state: () => ({
    posts: dataSource.posts
  }),
  getters: {},
  actions: {
    createPost (post) {
      post.id = 'aaaa-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated from DB.

      this.posts.push(post)

      const thread = useThreadsStore().threads.find(
        ({ id }) => id === post.threadId
      )
      thread.posts.push(post.id)
    }
  }
})
