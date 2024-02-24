import App from './App.vue'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import fontAwesome from '@/plugins/FontAwesome'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const auth = getAuth()
onAuthStateChanged(auth, user => {
  if (user) store.dispatch('fetchAuthUser')
  else store.dispatch('unsubscribeAuthUserSnapshot') // unsubscribe authenticated user Firebase realtime updates listener when sign out.
})

// --- forum App
const forumApp = createApp(App)

// plugins
forumApp.use(router)
forumApp.use(store)
forumApp.use(fontAwesome)

// The following snippet registers all base components, that prefix with 'App...' (i.e. AppDate). Hence no need to import them when use in other components.
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
