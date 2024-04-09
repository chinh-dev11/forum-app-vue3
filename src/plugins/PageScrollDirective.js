/* Caveats
Cannot use expression directly in custom directives, as with v-click for example, since the scope is not the same.
     <a v-page-scroll=”mobileNavMenu = false”… >
Instead we could pass a function, or simply an anonymous function as follow:
     <a v-page-scroll=”() ⇒ (mobileNavMenu = false)”
*/
import debounce from 'lodash/debounce'

const PageScrollDirective = {
  mounted (el, binding) {
    /*
    namespace with __method__ to prevent method name collision.
    use debouncing to limit the scroll event to fire too many unneccesary.
    ie. use debounce method from lodash library.
    */
    el.__PageScrollHandler__ = debounce(
      () => {
        binding.value() // invoking the anonymous function passed in the custom directive: () => (mobileNavMenu = false)
      },
      200, // timeout: 200 ms
      { leading: true } // invoking the function first, then do the timeout (200 ms) / false (default)
    )

    document.addEventListener('scroll', el.__PageScrollHandler__)
  },
  onUnmounted (el) {
    document.removeEventListener('scroll', el.__PageScrollHandler__)
  }
}

export default (app) => {
  app.directive('page-scroll', PageScrollDirective)
}
