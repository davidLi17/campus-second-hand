import { http } from '@/utils/http'

// src/api/types/upload.d.ts

// 文件上传响应类型
export interface UploadFileResult {
  code: number
  message: string
  data: string // 返回的文件URL
}

// 上传进度回调类型
export type UploadProgressCallback = (progress: number) => void

/**
 * 文件上传
 * @param filePath 本地文件路径
 * @param onProgress 上传进度回调
 */
export const uploadFileAPI = (
  filePath: string,
  onProgress?: UploadProgressCallback,
): Promise<UploadFileResult> => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: 'http://101.126.18.51:9990/upload', // 上传接口地址
      filePath,
      name: 'file', // 后端接收的文件字段名
      success: (res) => {
        console.log('上传结果:', res)
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(res.data) as UploadFileResult
            if (data.code === 0) {
              resolve(data)
            } else {
              reject(new Error(data.message || '上传失败'))
            }
          } catch (e) {
            reject(new Error('解析响应数据失败'))
          }
        } else {
          reject(new Error(`上传失败，状态码: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '上传请求失败'))
      },
      complete: (res) => {
        // 处理进度
        if (onProgress && res.progress !== undefined) {
          onProgress(res.progress)
        }
      },
    })
  })
}
