// 封装本地存储方法
export const setStorage = <T>(key: string, value: T) => {
  try {
    uni.setStorageSync(key, value)
  } catch (e) {
    console.error('Storage set error:', e)
  }
}

export const getStorage = <T>(key: string): T | undefined => {
  try {
    const value = uni.getStorageSync(key)
    return value as T
  } catch (e) {
    console.error('Storage get error:', e)
    return undefined
  }
}

export const removeStorage = (key: string) => {
  try {
    uni.removeStorageSync(key)
  } catch (e) {
    console.error('Storage remove error:', e)
  }
}
