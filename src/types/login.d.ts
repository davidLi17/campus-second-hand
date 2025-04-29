// 登录请求参数类型
export interface LoginParams {
  account: string
  password: string
}

// 登录响应数据类型
export interface LoginResult {
  id: number
  account: string
  avatar: string
  nickname: string
  token: string
  schoolId: number
  schoolName: string
  studentId: string
  expireTime: number
}

// 用户信息类型
export interface MemberProfile {
  id: number
  account: string
  nickname: string
  avatar: string
  phone?: string
  schoolId: number
  schoolName: string
  studentId: string
  creditScore: number
  createdAt: string
}
