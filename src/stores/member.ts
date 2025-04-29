import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { LoginParams, LoginResult, MemberProfile } from '@/types/login'
import { loginAPI, getMemberProfileAPI } from '@/api/member'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'

export const useMemberStore = defineStore('member', () => {
  // 用户信息
  const profile = ref<MemberProfile>()

  // 登录token
  const token = ref<string>()

  // 登录状态
  const isLogin = ref(false)

  // 登录方法
  const login = async (data: LoginParams) => {
    const res = await loginAPI(data)

    // 保存token
    token.value = res.token
    setStorage('token', res.token)

    // 获取用户信息
    await getProfile()

    // 更新登录状态
    isLogin.value = true

    return res
  }

  // 获取用户信息
  const getProfile = async () => {
    if (!token.value) return

    const res = await getMemberProfileAPI()
    profile.value = res
    setStorage('profile', res)
  }

  // 退出登录
  const logout = () => {
    token.value = undefined
    profile.value = undefined
    isLogin.value = false
    removeStorage('token')
    removeStorage('profile')
  }

  // 初始化时从本地存储加载
  const initFromStorage = () => {
    const storedToken = getStorage('token')
    const storedProfile = getStorage<MemberProfile>('profile')

    if (storedToken) {
      token.value = storedToken
      isLogin.value = true
    }

    if (storedProfile) {
      profile.value = storedProfile
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
  }
})
