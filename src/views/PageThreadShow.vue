<script>
import PostList from '@/components/PostList.vue'
import PostEditor from '@/components/PostEditor.vue'
// import firebase from 'firebase'
// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import { collection } from 'firebase/compat/firestore'

import { getFirestore, doc, onSnapshot } from 'firebase/firestore'

export default {
  components: { PostList, PostEditor },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    thread () {
      // console.log(' this.$store.getters.thread(this.id)', this.$store.getters.thread(this.id))
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      console.log('this.$store.state.posts.filter(({ threadId }) => threadId === this.thread.id)', this.$store.state.posts.filter(({ threadId }) => threadId === this.thread.id))
      return this.$store.state.posts.filter(({ threadId }) => threadId === this.thread.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.thread.id
      }

      this.$store.dispatch('createPost', { post })
    }
  },
  beforeCreate () {
    console.log('beforeCreate', this.id)
    const db = getFirestore()

    // fetch the thread
    onSnapshot(doc(db, 'threads', this.id), (docThread) => {
      const thread = { ...docThread.data(), id: docThread.id }
      this.$store.commit('setThread', { thread })

      // fetch the thread user
      onSnapshot(doc(db, 'users', thread.userId), (docUser) => {
        const user = { ...docUser.data(), id: docUser.id }
        this.$store.commit('setUser', { user })
      })

      // fetch the thread posts
      thread.posts.forEach((postId) => {
        onSnapshot(doc(db, 'posts', postId), (docPost) => {
          const post = { ...docPost.data(), id: docPost.id }
          this.$store.commit('setPost', { post })
        })
      })

      // fetch the thread contributors (users)
      thread.contributors.forEach((userId) => {
        onSnapshot(doc(db, 'users', userId), (docUser) => {
          const user = { ...docUser.data(), id: docUser.id }
          this.$store.commit('setUser', { user })
        })
      })
    })
  },
  created () {
    console.log('created', this.id)
    // const db = getFirestore()

    // // fetch the thread
    // onSnapshot(doc(db, 'threads', this.id), (doc) => {
    //   const thread = { ...doc.data(), id: doc.id }
    //   this.$store.commit('setThread', thread)
    // })

    // collection('threads').doc(this.id).onSnapshot((doc) => {
    // console.log(doc.data())
    // const thread = { ...doc.data(), id: doc.id }
    // this.$store.commit('setThread', { thread })
    // })
  }
}
</script>

<template>
  <div class="col-large push-top">
    <h1>
      {{ thread.title }}
      <!-- event and tag props are deprecated. Use scoped slots instead. -->
      <router-link
        :to="{ name: 'ThreadEdit', params: { id: thread.id } }"
        v-slot="{ navigate }"
        class="btn-green btn-small"
        ><button @click="navigate" role="link">Edit Thread</button></router-link
      >
    </h1>
    <p>
      By
      <a href="#" class="link-unstyled">{{ thread.author?.name }}</a
      >, <AppDate :timestamp="thread.publishedAt" />
      <span
        style="float: right; margin-top: 2px"
        class="hide-mobile text-faded text-small"
        >{{ thread.repliesCount }} repl{{
          thread.repliesCount ? "ies" : "y"
        }}
        by {{ thread.contributorsCount }} contributor{{
          thread.contributorsCount ? "s" : ""
        }}</span
      >
    </p>
    <PostList :posts="threadPosts" />
    <PostEditor @save="addPost" />
  </div>
</template>

<style scoped></style>
