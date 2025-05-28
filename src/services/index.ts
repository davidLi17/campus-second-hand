// src/utils/http.ts (完整改进版)
import { useMemberStore } from '@/stores/member'

const baseURL = 'http://101.126.18.51:9990'

// 白名单：不需要登录验证的接口路径
const whiteList = ['/login', '/register', '/email/send', '/email/verify']

// 检查URL是否在白名单中
const isInWhiteList = (url: string): boolean => {
  return whiteList.some((path) => url.includes(path))
}

const httpInterceptor = {
  invoke(options: UniApp.RequestOptions & { params?: Record<string, any> }) {
    const memberStore = useMemberStore()

    if (!options.header) options.header = {}

    // 添加 Token
    if (memberStore.token) {
      options.header.Authorization = `${memberStore.token}`
    }

    // 未登录拦截 - 使用白名单检查
    if (!memberStore.token && !isInWhiteList(options.url)) {
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
        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
        .join('&')
      options.url += (options.url.includes('?') ? '&' : '?') + queryString
      delete options.params
    }

    options.timeout = 10000
    return options
  },
}

// 注册拦截器
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

// 通用请求方法
export const http = <T>(options: UniApp.RequestOptions) => {
  let isUseJson = false
  // 打印完整请求信息
  console.log('[HTTP Request]', {
    url: baseURL + options.url,
    method: options.method,
    data: options.data,
    header: options.header,
  })
  if (options.method === 'POST' || options.method === 'PUT') {
    isUseJson = true
  }
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      url: baseURL + options.url,
      header: {
        'Content-Type': isUseJson ? 'application/json' : 'application/x-www-form-urlencoded',
        ...options.header,
      },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
        } else if (res.statusCode === 401) {
          // token过期处理
          const memberStore = useMemberStore()
          memberStore.logout()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          uni.showToast({
            title: (res.data as any).message || '请求错误',
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

const request = http
export default request
