import { http } from '@/utils/http'
import type { LoginParams, LoginResult, MemberProfile } from '@/types/login'

// 登录接口
export const loginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/member/login',
    data,
  })
}

// 获取用户信息接口
export const getMemberProfileAPI = () => {
  return http<MemberProfile>({
    method: 'GET',
    url: '/member/profile',
  })
}

// 其他可能的接口
export const logoutAPI = () => {
  return http({
    method: 'POST',
    url: '/member/logout',
  })
}
