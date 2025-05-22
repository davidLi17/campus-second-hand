// src/utils/http.ts (完整改进版)
import { useMemberStore } from '@/stores/member'

const baseURL = 'http://101.126.18.51:9990'

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    const memberStore = useMemberStore()

    if (!options.header) options.header = {}

    // 添加 Token
    if (memberStore.token) {
      options.header.Authorization = `Bearer ${memberStore.token}`
    }

    // 未登录拦截
    if (!memberStore.token && !options.url.includes('/login')) {
      uni.showToast({ title: '请先登录', icon: 'error' })
      uni.setStorageSync(
        'redirectUrl',
        `/${getCurrentPages()[getCurrentPages().length - 1]?.route}`,
      )
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/login/login' })
      }, 500)
      return Promise.reject(new Error('未登录'))
    }

    // GET 请求处理：将 params 转换为查询字符串
    if (options.method?.toUpperCase() === 'GET' && options.params) {
      const queryString = Object.entries(options.params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      options.url += (options.url.includes('?') ? '&' : '?') + queryString
      delete options.params
    }

    options.timeout = 10000
    return options
  },
}

// 判断是否是日期时间字符串
function isDateTimeString(str: string): boolean {
  return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)
}

// 递归转换日期字段
function convertDateFields(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDateFields(item))
  }

  const result: Record<string, any> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]

      if (typeof value === 'string' && isDateTimeString(value)) {
        // 将 "yyyy-MM-dd HH:mm:ss" 转换为 "yyyy-MM-ddTHH:mm:ss"
        result[key] = value.replace(' ', 'T')
      } else if (typeof value === 'object') {
        result[key] = convertDateFields(value)
      } else {
        result[key] = value
      }
    }
  }
  return result
}

// 注册拦截器
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      url: baseURL + options.url,
      success(res) {
        // 在返回数据前进行日期格式转换
        if (res.data) {
          try {
            res.data = convertDateFields(res.data)
          } catch (error) {
            console.error('日期格式转换失败:', error)
          }
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.logout()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          uni.showToast({
            title: (res.data as any)?.message || '请求错误',
            icon: 'none',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({
          title: '网络错误，请稍后重试',
          icon: 'none',
        })
        reject(err)
      },
    })
  })
}

// 封装常用的 HTTP 方法
export const get = <T>(url: string, params?: Record<string, any>) => {
  return http<T>({ url, method: 'GET', params })
}

export const post = <T>(url: string, data?: any) => {
  return http<T>({ url, method: 'POST', data, header: { 'Content-Type': 'application/json' } })
}

export const put = <T>(url: string, data?: any) => {
  return http<T>({ url, method: 'PUT', data, header: { 'Content-Type': 'application/json' } })
}

export const del = <T>(url: string, data?: any) => {
  return http<T>({ url, method: 'DELETE', data })
}
