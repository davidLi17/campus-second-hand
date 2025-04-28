import { http } from '@/utils/http'

// 获取地址列表
export const getAddressListAPI = () => {
  return http({
    method: 'GET',
    url: '/address/list',
  })
}

// 设置默认地址
export const setDefaultAddressAPI = (id: number) => {
  return http({
    method: 'POST',
    url: '/address/setDefault',
    data: { id },
  })
}

// 删除地址
export const deleteAddressAPI = (id: number) => {
  return http({
    method: 'POST',
    url: '/address/delete',
    data: { id },
  })
}
