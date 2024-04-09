import App from './App.vue'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import FontAwesome from '@/plugins/FontAwesome'
import ClickOutsideDirective from './plugins/ClickOutsideDirective'
import PageScrollDirective from './plugins/PageScrollDirective'

// --- forum App
const forumApp = createApp(App)

// plugins
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesome)
forumApp.use(ClickOutsideDirective) // custom directive
forumApp.use(PageScrollDirective) // custom directive

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
