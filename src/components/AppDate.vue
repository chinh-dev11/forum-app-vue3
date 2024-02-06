<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

export default {
  props: {
    timestamp: {
      type: [Number, Object], // secs in Unix format.
      default: null
    }
  },
  computed: {
    normalizedTimestamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    dateFromNow () {
      return dayjs.unix(this.normalizedTimestamp).fromNow() // e.g. 3 years ago.
    },
    humanReadableDate () {
      return dayjs.unix(this.normalizedTimestamp).format('llll') // e.g. Thu, Aug 16, 2018 8:02 PM.
    }
  }
}
</script>

<template>
  <span :title="humanReadableDate">
    {{ dateFromNow }}.
  </span>
</template>

<style scoped></style>
