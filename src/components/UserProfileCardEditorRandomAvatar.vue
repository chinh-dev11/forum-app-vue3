<script>
import { arrayRandom } from '@/helpers'

export default {
  methods: {
    async getRandomAvatar () {
      const searchTerms = ['animals', 'sports', 'landscape', 'building']
      const randomWord = arrayRandom(searchTerms)
      const res = await fetch(`https://pixabay.com/api/?key=44057270-e11dc43d6f09d479f69f78427&q=${randomWord}`)
      const data = await res.json()
      const randomImage = arrayRandom(data.hits)

      this.$emit('hit', randomImage.webformatURL)
    }
  }
}
</script>

<template>
  <div class="text-center" style="margin-bottom: 15px">
    <button @click.prevent="getRandomAvatar" class="btn-green btn-xsmall">
      Random Avatar</button
    ><br />
    <small style="opacity: 0.5"
      >Powered by <a href="https://pixabay.com">Pixabay</a></small
    >
  </div>
</template>

<style lang="scss" scoped></style>
