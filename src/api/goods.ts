import { http } from '@/utils/http'

import type { GoodsListResult } from '@/types/goods'

// 获取商品详情
export const getGoodsDetailAPI = (id: string) => {
  return http<any>({
    method: 'GET',
    url: `/goods/detail/${id}`,
  })
}

// 获取分类商品
export const getCategoryGoodsAPI = (type: string) => {
  return http<{
    list: any[]
    total: number
  }>({
    method: 'GET',
    url: '/goods/category',
    data: { type },
  })
}

// 添加商品
export const addGoodsAPI = (data: {
  categoryId: number
  name: string
  desc: string
  picture: string
  pictures: string[]
  price: number
  sellerId: number
  status?: number
}) => {
  return http({
    method: 'POST',
    url: '/user/goods/add',
    data,
  })
}

// 获取商品列表
export const getGoodsListAPI = (params: {
  page: number
  pageSize: number
  categoryId?: number
  school?: string
}) => {
  return http<GoodsListResult>({
    method: 'GET',
    url: '/goods/list',
    data: params,
  })
}
