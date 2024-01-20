import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)

// timestamp (secs) is in Unix format
function dateFromNow (timestamp) {
  return dayjs.unix(timestamp).fromNow() // e.g. 3 years ago
}

// timestamp (secs) is in Unix format
function humanReadableDate (timestamp) {
  return dayjs.unix(timestamp).format('llll') // e.g. Thu, Aug 16, 2018 8:02 PM
}

export {
  dateFromNow,
  humanReadableDate
}
