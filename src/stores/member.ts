// src/stores/member.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI } from '@/api/user'
import { getStorage, setStorage, removeStorage } from '@/utils/storage'
import type { LoginParams, LoginResult } from '@/types/user'
// 使用API返回的Data类型作为用户信息类型
type MemberProfile = LoginResult['data']

export const useMemberStore = defineStore('member', () => {
  // 用户信息（直接使用API返回的完整data结构）
  const profile = ref<MemberProfile>()

  // 登录token（直接从profile中获取，避免重复存储）
  const token = ref<string>()

  // 登录状态
  const isLogin = ref(false)

  // 登录方法
  const login = async (data: LoginParams) => {
    const res = await loginAPI(data)

    // 保存完整的用户信息
    profile.value = res.data
    setStorage('profile', res.data)

    // token从profile中获取（避免重复存储）
    token.value = res.data.token
    setStorage('token', res.data.token)

    // 更新登录状态
    isLogin.value = true

    return res
  }

  // 获取用户信息（直接从profile获取）
  const getProfile = () => profile.value

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
  }
})
