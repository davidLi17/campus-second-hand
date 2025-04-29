// 上传配置类型
interface UploadConfig {
  maxSize?: number // 最大文件大小（字节），默认2MB
  quality?: number // 压缩质量 0-1，默认0.7
  count?: number // 选择图片数量，默认1
}

// 上传结果类型
interface UploadResult {
  url: string // 文件URL
  size: number // 文件大小（字节）
  width?: number // 图片宽度（可选）
  height?: number // 图片高度（可选）
}

// 错误类型
interface UploadError extends Error {
  code?: 'SIZE_LIMIT' | 'UPLOAD_FAILED' | 'IMAGE_COMPRESS_FAILED'
}
// 默认配置
const DEFAULT_CONFIG: Required<UploadConfig> = {
  maxSize: 2 * 1024 * 1024, // 2MB
  quality: 0.7,
  count: 1,
}

/**
 * 图片上传工具函数
 * @param config 上传配置
 * @returns Promise<UploadResult[]>
 */
export const uploadImages = async (config?: UploadConfig): Promise<UploadResult[]> => {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config }

  try {
    // 1. 选择图片
    const chooseRes = await uni.chooseImage({
      count: mergedConfig.count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    const tempFiles = chooseRes.tempFiles
    const results: UploadResult[] = []

    // 2. 处理每张图片
    for (const file of tempFiles) {
      try {
        // 检查文件大小
        if (file.size > mergedConfig.maxSize) {
          throw {
            message: `图片大小不能超过${mergedConfig.maxSize / 1024 / 1024}MB`,
            code: 'SIZE_LIMIT',
          } as UploadError
        }

        // 压缩图片
        const compressedPath = await compressImage(file.path, mergedConfig.quality)

        // 获取图片尺寸（可选）
        const imgInfo = await getImageInfo(compressedPath)

        // 上传到服务器
        const uploadRes = await uploadToServer(compressedPath)

        results.push({
          url: uploadRes.url,
          size: file.size,
          width: imgInfo.width,
          height: imgInfo.height,
        })
      } catch (error) {
        console.error('单张图片上传失败:', error)
        continue // 跳过失败的图片
      }
    }

    if (results.length === 0) {
      throw { message: '所有图片上传都失败了', code: 'UPLOAD_FAILED' }
    }

    return results
  } catch (error) {
    throw formatUploadError(error)
  }
}

// 压缩图片（内部方法）
const compressImage = async (src: string, quality: number): Promise<string> => {
  try {
    const res = await uni.compressImage({
      src,
      quality: quality * 100,
    })
    return res.tempFilePath
  } catch (error) {
    console.warn('图片压缩失败，使用原图:', error)
    return src // 压缩失败返回原图
  }
}

// 获取图片信息（内部方法）
const getImageInfo = (path: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    uni.getImageInfo({
      src: path,
      success: (res) => resolve({ width: res.width, height: res.height }),
      fail: () => resolve({ width: 0, height: 0 }),
    })
  })
}

// 上传到服务器（内部方法）
const uploadToServer = async (path: string): Promise<{ url: string }> => {
  const formData = new FormData()
  formData.append('file', {
    uri: path,
    type: 'image/jpeg',
    name: `upload_${Date.now()}.jpg`,
  } as any)

  const response = await uni.request({
    url: '/upload', // 替换为你的上传接口
    method: 'POST',
    data: formData,
    header: {
      'Content-Type': 'multipart/form-data',
    },
  })

  if (response.statusCode !== 200) {
    throw { message: '上传失败', code: 'UPLOAD_FAILED' }
  }

  return { url: response.data.data } // 根据你的API结构调整
}

// 格式化错误（内部方法）
const formatUploadError = (error: any): UploadError => {
  if (error?.code) return error as UploadError

  return {
    message: error?.message || '上传过程中发生未知错误',
    code: 'UPLOAD_FAILED',
  }
}
