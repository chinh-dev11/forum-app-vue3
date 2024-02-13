<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({ text: '' })
    }
  },
  data () {
    return {
      postCopy: { ...this.post }
    }
  },
  methods: {
    save () {
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
    }
  }
}
</script>

<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <textarea
        v-model="postCopy.text"
        id="thread_content"
        class="form-input"
        name="content"
        rows="8"
        cols="140"
      ></textarea>
    </div>
    <div class="btn-group">
      <button v-if="!post.id" class="btn btn-ghost" type="reset">Cancel</button>
      <button class="btn btn-blue" type="submit" name="Publish">{{ post.id ? 'Update' : 'Submit' }} Post</button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
