import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/api/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import type { LoginParams, LoginResult } from '@/types/user'

// 完整的用户信息类型
export type MemberProfile = LoginResult['data']

export const useMemberStore = defineStore('member', () => {
  // 用户信息
  const profile = ref<MemberProfile>()
  // 登录token
  const token = ref<string>()
  // 登录状态
  const isLogin = ref(false)

  // 设置用户信息的增强方法
  const setProfile = (val: MemberProfile) => {
    profile.value = {
      ...val,
    }
    setStorage('profile', profile.value)
  }

  // 设置token的增强方法
  const setToken = (val: string) => {
    token.value = val
    setStorage('token', val)
  }

  // 登录方法
  const login = async (data: LoginParams) => {
    const res = await loginAPI(data)

    // 使用增强的设置方法
    setProfile(res.data)
    setToken(res.data.token)
    isLogin.value = true

    return res
  }

  // 获取用户信息
  const getProfile = () => profile.value

  // 登录成功后的处理
  const loginSuccess = (data: LoginResult['data']) => {
    setProfile(data)
    setToken(data.token)
    isLogin.value = true
  }

  // 退出登录
  const logout = () => {
    profile.value = undefined
    token.value = undefined
    isLogin.value = false
    removeStorage('profile')
    removeStorage('token')
  }

  // 初始化时从本地存储加载
  const initFromStorage = () => {
    const storedProfile = getStorage<MemberProfile>('profile')
    const storedToken = getStorage<string>('token')

    if (storedProfile) {
      profile.value = storedProfile
      isLogin.value = true
    }

    if (storedToken) {
      token.value = storedToken
    }
  }
  // 初始化
  initFromStorage()

  return {
    profile,
    token,
    isLogin,
    login,
    logout,
    getProfile,
    setProfile,
    setToken,
    loginSuccess,
    initFromStorage,
  }
})
