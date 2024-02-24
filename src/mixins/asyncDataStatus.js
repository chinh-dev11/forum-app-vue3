export default {
  data () {
    return {
      asyncDataStatus_ready: false
    }
  },
  methods: {
    // show content once data is fetched.
    asyncDataStatus_fetched () {
      this.asyncDataStatus_ready = true
      this.$emit('ready')
    }
  }
}
