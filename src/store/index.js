import { createStore } from 'vuex'
import dataSource from '@/data.json'

export default createStore({
  state: dataSource,
  actions: {
    createPost (context, post) {
      post.id = 'aaaa-' + Math.random() // temp dev value (could also use a package to generate ids). In real world, value should be generated form DB.

      context.commit('setPost', { post })
      context.commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    }
  },
  mutations: {
    setPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(({ id }) => id === threadId)
      thread.posts.push(postId)
    }
  }
})
