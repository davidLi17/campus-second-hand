// src/utils/url-utils.ts

/**
 * 将对象转换为URL查询字符串
 * @param params 参数对象
 * @param options 配置选项
 * @returns 拼接好的查询字符串（不带问号）
 */
export function buildQueryString(
  params: Record<string, any>,
  options?: {
    encode?: boolean // 是否进行URL编码（默认true）
    keepEmpty?: boolean // 是否保留空值（默认false）
  },
): string {
  const { encode = true, keepEmpty = false } = options || {}

  return Object.entries(params)
    .filter(([_, value]) => keepEmpty || value != null)
    .map(([key, value]) => {
      // 处理数组和对象
      if (Array.isArray(value)) {
        return value.map((v) => `${key}=${encode ? encodeURIComponent(v) : v}`).join('&')
      }
      return `${key}=${encode ? encodeURIComponent(value) : value}`
    })
    .join('&')
}

/**
 * 构建完整URL（自动处理参数拼接）
 * @param baseUrl 基础URL
 * @param params 参数对象
 * @param options 配置选项
 * @returns 完整URL
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, any>,
  options?: {
    encode?: boolean
    keepEmpty?: boolean
  },
): string {
  if (!params || Object.keys(params).length === 0) return baseUrl

  const queryString = buildQueryString(params, options)
  return baseUrl.includes('?') ? `${baseUrl}&${queryString}` : `${baseUrl}?${queryString}`
}
