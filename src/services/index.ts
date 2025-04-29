import { useMemberStore } from '@/stores'

// 基础配置
const BASE_CONFIG = {
  baseURL: 'https://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 10000,
  sourceClient: 'miniapp',
} as const

// 请求拦截器
const httpInterceptor: UniNamespace.InterceptorOptions = {
  invoke(options: UniApp.RequestOptions) {
    // 拼接完整请求地址
    options.url = options.url.startsWith('http') ? options.url : BASE_CONFIG.baseURL + options.url

    // 设置超时时间和请求头
    options.timeout = BASE_CONFIG.timeout
    options.header = {
      ...options.header,
      'source-client': BASE_CONFIG.sourceClient,
    }

    // 添加token认证
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }

    return options
  },
}

// 注册拦截器
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

// 统一错误提示
const showError = (message: string) => {
  uni.showToast({
    title: message,
    icon: 'fail',
    mask: true,
  })
}

// HTTP请求封装
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // 请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as T)
          return
        }

        // token失效
        if (res.statusCode === 401) {
          showError('登录过期')
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
          return
        }

        // 其他错误
        showError((res.data as Api.Schema.Result)?.message || '请求错误')
        reject(res)
      },
      fail(err) {
        showError('网络错误,检测网络是否链接')
        reject(err)
      },
    })
  })
}
const request = http
export default request
