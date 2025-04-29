// src/api/category.ts
import { http } from '@/utils/http'

/**
 * 获取一级分类列表
 */
export const getCategoryListAPI = () => {
  return http<{
    code: number
    data: Array<{
      id: number
      name: string
      categoryPic: string
    }>
    message: string
  }>({
    method: 'GET',
    url: '/home/category/head',
  })
}
