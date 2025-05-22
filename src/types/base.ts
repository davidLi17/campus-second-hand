// src/types/base.ts

/**
 * 基础响应类型
 * @template T 数据类型
 */
export interface Result<T = any> {
  /** 状态码 */
  code: number
  /** 数据 */
  data: T
  /** 消息 */
  message: string
}

/**
 * 分页结果类型
 * @template T 列表项类型
 */
export interface PageResult<T = any> {
  /** 当前页数据 */
  items: T[]
  /** 当前页码 */
  page: number
  /** 每页数量 */
  pageSize: number
  /** 总页数 */
  pages: number
  /** 总数量 */
  total: number
}

/**
 * 分页查询参数
 */
export interface PageParams {
  /** 当前页码 */
  page?: number
  /** 每页数量 */
  pageSize?: number
}

/**
 * 基础实体类型
 */
export interface BaseEntity {
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 基础查询参数
 */
export interface QueryParams {
  /** 关键词 */
  keyword?: string
  /** 状态 */
  status?: number
  /** 开始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
}
