import { http } from '@/utils/http'
import type {
  CreateSessionRequest,
  CreateSessionResponse,
  GetSessionResponse,
  GetMessageRequest,
  GetMessageResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/chat'

/**
 * 创建聊天会话
 */
export const createSessionAPI = (params: CreateSessionRequest) => {
  return http<CreateSessionResponse>({
    url: '/chat/createSession',
    method: 'GET',
    data: params,
  })
}

/**
 * 获取会话列表
 */
export const getSessionAPI = () => {
  return http<GetSessionResponse>({
    url: '/chat/getSession',
    method: 'GET',
  })
}

/**
 * 获取会话消息记录
 */
export const getMessageAPI = (params: GetMessageRequest) => {
  return http<GetMessageResponse>({
    url: '/chat/getMessage',
    method: 'GET',
    data: params,
  })
}

/**
 * 发送消息
 */
export const sendMessageAPI = (params: SendMessageRequest) => {
  const { message, sessionId, toUser } = params
  return http<SendMessageResponse>({
    url: `/chat/send?message=${encodeURIComponent(
      message,
    )}&sessionId=${sessionId}&toUser=${toUser}`,
    method: 'POST',
  })
}
