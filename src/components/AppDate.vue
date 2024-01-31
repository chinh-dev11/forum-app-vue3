<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  props: {
    timestamp: {
      type: Number, // secs in Unix format.
      default: null
    }
  },
  methods: {
    dateFromNow () {
      return dayjs.unix(this.timestamp).fromNow() // e.g. 3 years ago.
    },

    humanReadableDate () {
      return dayjs.unix(this.timestamp).format('llll') // e.g. Thu, Aug 16, 2018 8:02 PM.
    }
  }
}
</script>

<template>
  <span v-if="timestamp" :title="humanReadableDate()">
    {{ dateFromNow() }}.
  </span>
</template>

<style scoped></style>
