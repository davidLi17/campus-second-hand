// 获取商品状态文本
export const getStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: '在售',
    1: '已售',
    2: '下架',
  }
  return statusMap[status] || '未知'
}

// 获取商品状态类名
export const getStatusClass = (status: number): string => {
  return `status-${status}`
}

// 格式化日期
export const formatDate = (date: string | Date): string => {
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
  return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
    .getDate()
    .toString()
    .padStart(2, '0')}`
}
