// src/api/address.ts
import { http } from '@/utils/http'

/**
 * 地址簿数据结构
 */
export interface AddressBook {
  id?: number
  userId?: number
  consignee: string
  phone: string
  provinceName: string
  cityName: string
  districtName: string
  detail: string
  label?: string
  isDefault?: number
}

/**
 * 分页查询结果
 */
export interface PageResult<T> {
  items: T[]
  page: number
  pageSize: number
  pages: number
  total: number
}

/**
 * 地址管理API
 */
export const addressApi = {
  /**
   * 添加收货地址
   * @param data 地址信息
   */
  addAddress(data: AddressBook) {
    return http({
      url: '/user/address/add',
      method: 'POST',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 删除收货地址
   * @param id 地址ID
   */
  deleteAddress(id: number) {
    return http({
      url: `/user/address/delete?id=${id}`,
      method: 'DELETE',
    })
  },

  /**
   * 获取当前用户所有地址
   */
  getAllAddresses() {
    return http<AddressBook[]>({
      url: '/user/address/list',
      method: 'GET',
    })
  },

  /**
   * 更新收货地址
   * @param data 地址信息
   */
  updateAddress(data: AddressBook) {
    return http({
      url: '/user/address/update',
      method: 'PUT',
      data,
      header: {
        'Content-Type': 'application/json',
      },
    })
  },

  /**
   * 分页查询地址
   * @param params 分页参数
   */
  getAddressesByPage(params: { page?: number; pageSize?: number }) {
    return http<PageResult<AddressBook>>({
      url: '/user/member/address',
      method: 'GET',
      params,
    })
  },
}
