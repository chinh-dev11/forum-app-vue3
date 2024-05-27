import App from './App.vue'
import { createApp } from 'vue'
import router from '@/router'
import store from '@/store'
import FontAwesomePlugin from '@/plugins/FontAwesomePlugin'
import ClickOutsideDirective from './plugins/ClickOutsideDirective'
import PageScrollDirective from './plugins/PageScrollDirective'
import Vue3PaginationPlugin from './plugins/Vue3PaginationPlugin'
import VeeValidatePlugin from './plugins/VeeValidatePlugin'

// --- forum App
const forumApp = createApp(App)

// plugins
forumApp.use(router)
forumApp.use(store)
forumApp.use(FontAwesomePlugin) // custom component
forumApp.use(ClickOutsideDirective) // custom directive
forumApp.use(PageScrollDirective)
forumApp.use(Vue3PaginationPlugin)
forumApp.use(VeeValidatePlugin)

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
