import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required } from '@vee-validate/rules'

export default (app) => {
  // defineRule('required', (value) => {
  //   if (value && value.trim()) return true
  //   return 'This is required'
  // })
  defineRule('required', required)

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
