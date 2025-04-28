import { http } from '@/utils/http'
import type { BannerItem, GoodsItem } from '@/types/home'

// 获取轮播图
export const getBannerListAPI = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
  })
}

// 获取商品列表
export const getGoodsListAPI = (data: { page: number; pageSize: number; categoryId?: number }) => {
  return http<{
    list: GoodsItem[]
    total: number
  }>({
    method: 'GET',
    url: '/home/goods',
    data,
  })
}
