// 登录请求参数类型
export interface LoginParams {
  username?: string
  email?: string
  password: string
  type: 'account' | 'sms'
}

// 登录响应数据类型
export interface LoginResult {
  code: number
  message: string
  data: {
    id: number
    username: string
    nickname: string
    phone: string | null
    userPic: string | null
    roleId: number
    token: string
  }
}

// 用户信息类型
export interface MemberProfile {
  id: number
  username: string
  nickname: string
  phone: string | null
  userPic: string | null
  roleId: number
  token: string
}
