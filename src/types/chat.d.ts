export type RequestMessage = '操作成功' | '操作失败'
export enum ResponseCode {
  SUCCESS = 0,
  ERROR = 1,
}
export interface CreateSessionRequest {
  toUser: number // 目标用户ID
}

export interface CreateSessionResponse {
  code: ResponseCode
  data: string // sessionId
  message: RequestMessage
}

export interface GetSessionResponse {
  code: ResponseCode
  data: GetSessionDatum[]
  message: RequestMessage
}

export interface GetSessionDatum {
  contactId: number // 联系人ID
  contactName: string // 联系人名称
  lastUpdateDate: number // 最后更新时间戳
  sessionId: string // 会话ID
  userId: number // 用户ID
}

export interface GetMessageRequest {
  sessionId: string // 会话ID
}

export interface GetMessageResponse {
  code: ResponseCode
  data: GetMessageDatum[]
  message: RequestMessage
}

export interface GetMessageDatum {
  contactId: number // 联系人ID
  contactType: number // 联系人类型
  fileName?: string // 文件名称（可选）
  fileSize?: number // 文件大小（可选）
  fileType: number // 文件类型
  messageContent: string // 消息内容
  messageId: number // 消息ID
  messageType: number // 消息类型
  sendTime: number // 发送时间戳
  sendUserId: number // 发送者ID
  sendUserNickName?: string // 发送者昵称（可选）
  sessionId: string // 会话ID
  status: number // 消息状态
}

export interface SendMessageRequest {
  message: string // 消息内容
  sessionId: string // 会话ID
  toUser: number // 接收者ID
}

export interface SendMessageResponse {
  code: ResponseCode
  data: null
  message: RequestMessage
}
