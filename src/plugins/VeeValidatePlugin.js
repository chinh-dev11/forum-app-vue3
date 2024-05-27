import { defineRule, Form, Field, ErrorMessage } from 'vee-validate'
import { required, email } from '@vee-validate/rules'
// import { required, email, min } from '@vee-validate/rules'

export default (app) => {
  // defineRule('required', (value) => {
  //   if (value && value.trim()) return true
  //   return 'This is required'
  // })
  // defineRule('min', (value, [limit]) => {
  //   console.log('min', value, limit)
  //   return min(value, [limit])
  // })

  defineRule('required', required)
  defineRule('email', email)

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
