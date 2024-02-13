<script>
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    save () {
      const post = {
        // edited: {},
        text: this.text
        // text: this.$refs.textarea.value, // to fix browser error: Assertion failed: Input argument is not an HTMLInputElement.
      }

      this.$emit('save', { post })

      this.text = ''
    }
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_content">Content:</label>
      <!-- since 2-way binding uses input event, it causes an error on textarea element 'Assertion failed: Input argument is not an HTMLInputElement' -->
      <textarea
        v-model="text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
      <!-- to fix the error 'Assertion failed: Input argument is not an HTMLInputElement' -->
      <!-- <textarea
          :value="text"
          ref="textarea"
          id="thread_content"
          class="form-input"
          name="content"
          rows="8"
          cols="140"
        /> -->
    </div>
    <div class="btn-group">
      <button class="btn btn-ghost" type="reset">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">Publish</button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
