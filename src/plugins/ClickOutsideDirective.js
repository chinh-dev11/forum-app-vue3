/* Caveats
Cannot use expression directly in custom directives, as with v-click for example, since the scope is not the same.
     <a v-click-outside=”mobileNavMenu = false”… >
Instead we could pass a function, or simply an anonymous function as follow:
     <a v-click-outside=”() ⇒ (mobileNavMenu = false)”
*/

const ClickOutsideDirective = {
  mounted (el, binding) {
    // namespace with __method__ to prevent method name collision.
    el.__ClickOutsideHandler__ = event => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event) // invoking the anonymous function passed in the custom directive: () => (mobileNavMenu = false)
      }
    }

    document.body.addEventListener('click', el.__ClickOutsideHandler__)
  },
  unmounted (el) {
    document.body.removeEventListener('click', el.__ClickOutsideHandler__)
  }
}

export default (app) => {
  app.directive('click-outside', ClickOutsideDirective) // register the directive in the app.
}
