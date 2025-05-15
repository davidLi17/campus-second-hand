import { useMemberStore } from '@/stores/member'

// 请求基地址
const baseURL = 'http://101.126.18.51:9990'

// 拦截器配置
const httpInterceptor = {
  // 拦截前处理
  invoke(options: UniApp.RequestOptions) {
    // 添加请求头
    if (!options.header) {
      options.header = {}
    }

    // 添加token
    const memberStore = useMemberStore()
    if (memberStore.token) {
      options.header.Authorization = `${memberStore.token}`
    }
    if (!memberStore.token && !options.url.includes('/login')) {
      uni.showToast({
        title: '请先登录',
        icon: 'error',
      })
      // 保存当前页面路径
      uni.setStorageSync(
        'redirectUrl',
        `/${getCurrentPages()[getCurrentPages().length - 1]?.route}`,
      )
      setTimeout(() => {
        uni.navigateTo({
          url: '/pages/login/login',
        })
      }, 500)
      return Promise.reject(new Error('未登录'))
    }
    // 超时时间
    options.timeout = 10000
    return options
  },
}

// 注册拦截器
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

// 通用请求方法
export const http = <T>(options: UniApp.RequestOptions) => {
  // 打印完整请求信息
  console.log('[HTTP Request]', {
    url: baseURL + options.url,
    method: options.method,
    params: options.params,
    header: options.header,
  })
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      url: baseURL + options.url,
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
