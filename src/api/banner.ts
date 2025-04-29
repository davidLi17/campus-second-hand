// src/api/banner.ts
import { http } from '@/utils/http'
import { buildUrl } from '@/utils/url-utils'

export const getBannerListAPI = (params?: { page?: number; pageSize?: number; type?: string }) => {
  return http<BannerListResponse>({
    method: 'GET',
    url: buildUrl('/banner/list', {
      page: params?.page || 1,
      pageSize: params?.pageSize || 10,
      type: params?.type, // 可选参数自动处理
    }),
  })
}

interface BannerListResponse {
  code: number
  data: {
    items: BannerItem[]
    page: number
    pageSize: number
    total: number
    pages: number
  }
  message: string
}

interface BannerItem {
  id: number
  imgUrl: string
  createTime: string
  updateTime: string
}
