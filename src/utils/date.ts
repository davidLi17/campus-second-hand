// 格式化日期
export const formatDate = (date: string | Date) => {
  if (!date) return ''

  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  // 1分钟内的显示"刚刚"
  if (diff < 60000) return '刚刚'

  // 1小时内的显示"X分钟前"
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`

  // 24小时内的显示"X小时前"
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`

  // 7天内的显示"X天前"
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  // 超过7天显示具体日期
  return `${d.getMonth() + 1}月${d.getDate()}日`
}
