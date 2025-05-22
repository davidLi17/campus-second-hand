// src/types/user.ts

/**
 * 登录类型枚举
 */
export enum LoginType {
  ACCOUNT = 'account', // 账号密码登录
  SMS = 'sms', // 短信验证码登录
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  type?: LoginType // 登录类型
  username?: string // 用户名
  password?: string // 密码
  phone?: string // 手机号(短信登录时使用)
  code?: string // 验证码(短信登录时使用)
}

/**
 * 登录响应数据
 */
export interface UserLoginVO {
  id: number
  nickname: string
  phone: string
  roleId: number
  token: string
  userPic: string
  username: string
}

/**
 * 注册请求参数
 */
export interface RegisterParams {
  username: string
  password: string
  email?: string
  code?: string
}

// src/api/user.ts
import { http } from '@/utils/http'
// import type { LoginParams, UserLoginVO, RegisterParams } from '@/types/user'

/**
 * 用户登录
 * @param params 登录参数
 * @returns 登录结果
 */
export const loginApi = (params: LoginParams) => {
  return http<UserLoginVO>({
    method: 'POST',
    url: '/user/login',
    data: params,
  })
}

/**
 * 用户注册
 * @param params 注册参数
 * @returns 注册结果
 */
export const registerApi = (params: RegisterParams) => {
  return http({
    method: 'POST',
    url: '/user/register',
    data: params,
  })
}
