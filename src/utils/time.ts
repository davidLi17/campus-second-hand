import moment from 'moment'

export const formatTime = (timestamp: number): string => {
  const date = moment(timestamp)
  const now = moment()
  const diffSeconds = now.diff(date, 'seconds')
  const diffMinutes = now.diff(date, 'minutes')
  const diffHours = now.diff(date, 'hours')
  const diffDays = now.diff(date, 'days')
  const diffYears = now.diff(date, 'years')

  if (diffSeconds < 60) {
    return '刚刚'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`
  } else if (diffHours < 24 && now.isSame(date, 'day')) {
    return `${diffHours}小时前`
  } else if (diffDays === 1) {
    return `昨天 ${date.format('HH:mm')}`
  } else if (diffDays === 2) {
    return `前天 ${date.format('HH:mm')}`
  } else if (diffYears === 0) {
    return date.format('M-D HH:mm')
  } else {
    return date.format('YYYY-M-D HH:mm')
  }
}
