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

/**
 * 处理API错误响应的通用函数
 * @param res API响应对象
 * @param options 配置选项
 */
export const handleApiError = (
  res: any,
  options: {
    duplicateAction?: () => void // 当检测到重复数据时的回调
    defaultTitle?: string // 默认错误提示标题
    showModal?: boolean // 是否显示模态框而不是toast
  } = {},
) => {
  const { duplicateAction, defaultTitle = '操作失败', showModal = false } = options

  const message = res.message || res.msg || ''

  // 检查是否是数据库主键冲突错误
  if (message.includes('Duplicate entry') && message.includes('PRIMARY')) {
    if (duplicateAction) {
      duplicateAction()
    } else {
      const content = '数据已存在，请检查后重试'
      if (showModal) {
        uni.showModal({
          title: '提示',
          content,
          showCancel: false,
        })
      } else {
        uni.showToast({
          title: content,
          icon: 'none',
        })
      }
    }
    return
  }

  // 检查是否是其他重复数据的提示
  if (message.includes('已存在') || message.includes('exist') || message.includes('###')) {
    if (duplicateAction) {
      duplicateAction()
    } else {
      const content = '数据已存在'
      if (showModal) {
        uni.showModal({
          title: '提示',
          content,
          showCancel: false,
        })
      } else {
        uni.showToast({
          title: content,
          icon: 'none',
        })
      }
    }
    return
  }

  // 其他错误情况
  const errorMessage = message || defaultTitle
  if (showModal) {
    uni.showModal({
      title: '错误',
      content: errorMessage,
      showCancel: false,
    })
  } else {
    uni.showToast({
      title: errorMessage,
      icon: 'none',
    })
  }
}

/**
 * 处理聊天会话相关的错误
 * @param res API响应对象
 */
export const handleChatSessionError = (res: any) => {
  handleApiError(res, {
    duplicateAction: () => {
      uni.showModal({
        title: '提示',
        content: '您已经与该用户建立了聊天会话，是否前往查看？',
        confirmText: '前往聊天',
        cancelText: '取消',
        success: (modalRes) => {
          if (modalRes.confirm) {
            uni.switchTab({
              url: '/pages/message/message',
            })
          }
        },
      })
    },
    defaultTitle: '创建会话失败',
    showModal: false,
  })
}
