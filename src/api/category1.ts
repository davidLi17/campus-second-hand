// src/api/category.ts
import { http } from '@/utils/http'
import type { PageResult, Result } from '@/types/base'

// 分类基础类型定义
export interface Category {
  id?: number
  name: string
  categoryPic?: string
  createTime?: string
  updateTime?: string
}

export interface CategoryTwo {
  id?: number
  name: string
  categoryId?: number
  parentName?: string
  categoryPic?: string
  createTime?: string
  updateTime?: string
}

export interface CategoryVO extends Category {
  children?: CategoryTwo[]
  goods?: GoodVO[]
}

export interface CategoryTwoVO extends CategoryTwo {
  goods?: GoodVO[]
}

export interface GoodVO {
  id?: number
  name?: string
  price?: number
  desc?: string
  picture?: string
  pictures?: string[]
  status?: number
  categoryId?: number
  categoryName?: string
  parentId?: number
  parentName?: string
  sellerId?: number
  sellerName?: string
  collectCount?: number
  commentCount?: number
  likeCount?: number
}

// 分页查询参数
interface PageParams {
  page?: number
  pageSize?: number
}

interface CategoryPageQueryDTO {
  categoryId?: number
  page?: number
  pageSize?: number
}

// API 实现
export const categoryApi = {
  /**
   * 根据ID查询一级分类
   * @param id 分类ID
   */
  getById(id?: number): Promise<Result<CategoryVO>> {
    return http({
      url: '/category',
      method: 'GET',
      params: { id },
    })
  },

  /**
   * 添加一级分类
   * @param data 分类数据
   */
  add(data: Category): Promise<Result<void>> {
    return http({
      url: '/category/add',
      method: 'POST',
      data,
    })
  },

  /**
   * 查询所有一级分类
   */
  getAll(): Promise<Result<Category[]>> {
    return http({
      url: '/category/alllist',
      method: 'GET',
    })
  },

  /**
   * 删除一级分类
   * @param id 分类ID
   */
  delete(id: number): Promise<Result<void>> {
    return http({
      url: '/category/delete',
      method: 'DELETE',
      params: { id },
    })
  },

  /**
   * 根据分类ID分页查询商品
   * @param params 查询参数
   */
  getGoodsByCategory(params: CategoryPageQueryDTO): Promise<Result<PageResult<GoodVO>>> {
    return http({
      url: '/category/goods/temporary',
      method: 'POST',
      data: params,
    })
  },

  /**
   * 分页查询一级分类
   * @param params 分页参数
   */
  getPageList(params: PageParams): Promise<Result<PageResult<Category>>> {
    return http({
      url: '/category/list',
      method: 'GET',
      params,
    })
  },

  /**
   * 根据名称搜索分类商品
   * @param params 搜索参数
   */
  search(params: { name: string } & PageParams): Promise<Result<PageResult<GoodVO>>> {
    return http({
      url: '/category/search',
      method: 'GET',
      params,
    })
  },

  /**
   * 根据二级分类ID查询商品
   * @param id 二级分类ID
   */
  getBySubId(id: number): Promise<Result<CategoryTwoVO>> {
    return http({
      url: '/category/sub',
      method: 'GET',
      params: { id },
    })
  },

  /**
   * 添加二级分类
   * @param data 二级分类数据
   */
  addSub(data: CategoryTwo): Promise<Result<void>> {
    return http({
      url: '/category/sub/add',
      method: 'POST',
      data,
    })
  },

  /**
   * 删除二级分类
   * @param id 二级分类ID
   */
  deleteSub(id: number): Promise<Result<void>> {
    return http({
      url: '/category/sub/delete',
      method: 'DELETE',
      params: { id },
    })
  },

  /**
   * 查询所有二级分类
   */
  getAllSub(): Promise<Result<CategoryTwo[]>> {
    return http({
      url: '/category/sub/list',
      method: 'GET',
    })
  },

  /**
   * 分页查询二级分类
   * @param params 分页参数
   */
  getSubPageList(
    params: { categoryId?: number } & PageParams,
  ): Promise<Result<PageResult<CategoryTwo>>> {
    return http({
      url: '/category/sub/pagelist',
      method: 'GET',
      params,
    })
  },

  /**
   * 修改二级分类
   * @param data 二级分类数据
   */
  updateSub(data: CategoryTwo): Promise<Result<void>> {
    return http({
      url: '/category/sub/update',
      method: 'PUT',
      data,
    })
  },

  /**
   * 修改一级分类
   * @param data 分类数据
   */
  update(data: Category): Promise<Result<void>> {
    return http({
      url: '/category/update',
      method: 'PUT',
      data,
    })
  },
}
