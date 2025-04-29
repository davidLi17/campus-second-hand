import { http } from '@/utils/http'

// 获取购物车列表
export const getCartListAPI = () => {
  return http({
    method: 'GET',
    url: '/cart/list',
  })
}

// 更新购物车商品数量
export const updateCartItemAPI = (id: number, count: number) => {
  return http({
    method: 'POST',
    url: '/cart/update',
    data: { id, count },
  })
}

// 删除购物车商品
export const deleteCartItemAPI = (id: number) => {
  return http({
    method: 'POST',
    url: '/cart/delete',
    data: { id },
  })
}
