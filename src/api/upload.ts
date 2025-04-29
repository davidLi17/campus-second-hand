import { http } from '@/utils/http'

// 上传文件
export const uploadFileAPI = (filePath: string, onProgressUpdate?: (progress: number) => void) => {
  return new Promise<{ url: string }>((resolve, reject) => {
    uni.uploadFile({
      url: 'https://your-api-domain.com/upload', // 替换为实际接口地址
      filePath,
      name: 'file',
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(res.data))
        } else {
          reject(new Error('上传失败'))
        }
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        onProgressUpdate?.(100)
      },
    })
  })
}
