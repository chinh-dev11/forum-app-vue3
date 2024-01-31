import App from './App.vue'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'

// --- Firebase ---
// Error: Module not found: Error: Package path . is not exported from package.
// import firebase from 'firebase'
// Fix: compat packages are API compatible with namespaced code
import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import firebaseConfig from '@/config/firebase'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

// --- forum App ---
const forumApp = createApp(App)

forumApp.use(router)
forumApp.use(store)

const requireComponent = require.context('./components', true, /App[A-Z]\w+\.(vue|js)$/)
requireComponent.keys().forEach(function (fileName) {
  let baseComponentConfig = requireComponent(fileName)
  baseComponentConfig = baseComponentConfig.default || baseComponentConfig
  const baseComponentName = baseComponentConfig.name || (
    fileName
      .replace(/^.+\//, '')
      .replace(/\.\w+$/, '')
  )
  forumApp.component(baseComponentName, baseComponentConfig)
})

forumApp.mount('#app')
