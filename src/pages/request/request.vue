<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemberStore } from '@/stores/member'
import { PurchaseGoodsGetAll } from '@/services/services.ts'
import type Api from '@/types/index'
import { uploadFileAPI } from '@/api/upload'
import { CATEGORY_OPTIONS, GoodsCategory } from '@/types/enums'
const memberStore = useMemberStore()

// 表单数据
const formData = ref<Api.Paths.APostPurchase.Request>({
  count: 1, // 求购数量
  desc: '', // 商品描述
  name: '', // 商品名称
  price: 0, // 期望价格
  sort: 0, // 商品类别
  status: 1, // 默认启用
  transaction: 0, // 默认线上交易
  image: '', // 商品图片
})
// 交易方式选项
const transactionOptions = [
  { value: 0, label: '线上交易' },
  { value: 1, label: '线下交易' },
]

// 分类选项
// 使用导入的分类选项替换原有的硬编码数组
const categories = ref(CATEGORY_OPTIONS)
// 上传状态
const isUploading = ref(false)

// 上传图片
// 完善的上传组件逻辑
const uploadImage = async () => {
  try {
    isUploading.value = true
    const res = await uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    const filePath = res.tempFilePaths[0]
    const fileInfo = await getFileSize(filePath)

    if (fileInfo.size > 10 * 1024 * 1024) {
      throw new Error('图片大小不能超过10MB')
    }

    const compressedPath = await compressImage(filePath)
    const { url } = await uploadFileAPI(compressedPath)
    formData.value.image = url
  } catch (error: any) {
    uni.showToast({
      title: error.message || '上传失败',
      icon: 'none',
    })
  } finally {
    isUploading.value = false
  }
}

// 获取文件大小
const getFileSize = (path: string) => {
  return new Promise<{ size: number }>((resolve) => {
    uni.getFileInfo({
      filePath: path,
      success: (res) => resolve(res),
      fail: () => resolve({ size: 0 }),
    })
  })
}

// 图片压缩
const compressImage = (src: string, quality = 0.7) => {
  return new Promise<string>((resolve) => {
    uni.compressImage({
      src,
      quality: quality * 100,
      success: (res) => resolve(res.tempFilePath),
      fail: () => resolve(src), // 压缩失败返回原图
    })
  })
}

// // 移除图片
// const removeImage = (index: number) => {
//   // 如果移除的是主图，需要重新设置主图
//   if (formData.value.picture === formData.value.pictures[index]) {
//     formData.value.picture = formData.value.pictures[0] || ''
//   }
//   formData.value.pictures.splice(index, 1)
// }

// // 设置主图
// const setMainImage = (url: string) => {
//   formData.value.picture = url
// }

// 修改表单验证
const validateForm = () => {
  if (!formData.value.name.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return false
  }

  if (!formData.value.sort) {
    uni.showToast({ title: '请选择商品分类', icon: 'none' })
    return false
  }

  if (!formData.value.price || formData.value.price <= 0) {
    uni.showToast({ title: '请输入合理的价格', icon: 'none' })
    return false
  }

  if (!formData.value.count || formData.value.count <= 0) {
    uni.showToast({ title: '请输入求购数量', icon: 'none' })
    return false
  }

  if (!formData.value.image) {
    uni.showToast({ title: '请上传商品图片', icon: 'none' })
    return false
  }

  return true
}

// 修改提交表单逻辑
const submitForm = async () => {
  if (!validateForm()) return

  try {
    uni.showLoading({ title: '发布中...' })

    // 添加时间戳
    const submitData = {
      ...formData.value,
      createTime: Date.now(),
      updateTime: Date.now(),
    }

    await PurchaseGoodsGetAll(submitData)

    uni.hideLoading()
    uni.showToast({ title: '发布成功', icon: 'success' })

    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (error: any) {
    uni.hideLoading()
    uni.showToast({
      title: error.message || '发布失败',
      icon: 'none',
    })
  }
}
</script>

<template>
  <view class="publish-page">
    <!-- 表单区域 -->
    <scroll-view class="form-container" scroll-y>
      <!-- 商品图片上传 -->
      <view class="form-section">
        <text class="section-title">商品图片</text>
        <text class="section-tip">(目前只支持上传一个图片)</text>

        <view class="image-uploader">
          <!-- 已上传图片 -->
          <view class="image-item" v-if="formData.image">
            <image class="image" :src="formData.image" mode="aspectFill" />
            <view class="image-remove" @click="formData.image = ''">
              <uni-icons type="closeempty" size="18" color="#fff" />
            </view>
          </view>

          <!-- 上传按钮，仅在未上传图片时显示 -->
          <view class="upload-btn" @click="uploadImage" v-if="!formData.image">
            <uni-icons type="plusempty" size="40" color="#ccc" />
            <text class="upload-text">添加图片</text>
          </view>
        </view>

        <view class="uploading-text" v-if="isUploading">图片上传中...</view>
      </view>

      <!-- 商品基本信息 -->
      <view class="form-section">
        <text class="section-title">基本信息</text>

        <view class="form-item">
          <text class="label">商品名称</text>
          <input
            class="input"
            v-model="formData.name"
            placeholder="请输入商品名称"
            maxlength="30"
          />
        </view>

        <view class="form-item">
          <text class="label">商品分类</text>
          <picker
            class="picker"
            mode="selector"
            :range="categories"
            range-key="name"
            @change="(e) => (formData.categoryId = categories[e.detail.value].id)"
          >
            <view class="picker-view">
              <text v-if="formData.categoryId">
                {{ categories.find((c) => c.id === formData.categoryId)?.name }}
              </text>
              <text v-else class="placeholder">请选择商品分类</text>
              <uni-icons type="arrowright" size="16" color="#999" />
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">商品价格</text>
          <input class="input" v-model="formData.price" type="number" placeholder="请输入价格" />
          <text class="unit">元</text>
        </view>
      </view>

      <!-- 商品描述 -->
      <view class="form-section">
        <text class="section-title">商品描述</text>
        <textarea
          class="textarea"
          v-model="formData.desc"
          placeholder="请输入商品详细描述（新旧程度、使用情况等）"
          maxlength="500"
        />
        <text class="word-count">{{ formData.desc.length }}/500</text>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button class="submit-btn" @click="submitForm" :disabled="isUploading">发布商品</button>
    </view>
  </view>
</template>

<style lang="scss">
.publish-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .form-container {
    flex: 1;
    padding: 20rpx 30rpx;
  }

  .form-section {
    margin-bottom: 30rpx;
    padding: 30rpx;
    background-color: #fff;
    border-radius: 16rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
    }

    .section-tip {
      font-size: 24rpx;
      color: #999;
      margin-left: 10rpx;
    }
  }

  /* 图片上传样式 */
  .image-uploader {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20rpx;

    .image-item {
      position: relative;
      width: 210rpx;
      height: 210rpx;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 8rpx;
      overflow: hidden;

      &.main-image {
        border: 2rpx solid #27ba9b;
      }

      .image {
        width: 100%;
        height: 100%;
      }

      .image-remove {
        position: absolute;
        top: 0;
        right: 0;
        width: 40rpx;
        height: 40rpx;
        background-color: rgba(0, 0, 0, 0.5);
        border-bottom-left-radius: 40rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .main-tag {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        font-size: 24rpx;
        color: #fff;
        background-color: rgba(39, 186, 155, 0.8);
      }
    }

    .upload-btn {
      width: 210rpx;
      height: 210rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1rpx dashed #ccc;
      border-radius: 8rpx;

      .upload-text {
        font-size: 24rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
  }

  .uploading-text {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
    text-align: center;
  }

  /* 表单元素样式 */
  .form-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .label {
      width: 160rpx;
      font-size: 28rpx;
      color: #333;
    }

    .input {
      flex: 1;
      font-size: 28rpx;
    }

    .picker-view {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .placeholder {
        color: #999;
      }
    }

    .unit {
      font-size: 28rpx;
      color: #333;
      margin-left: 10rpx;
    }
  }

  /* 文本域样式 */
  .textarea {
    width: 100%;
    height: 200rpx;
    margin-top: 20rpx;
    padding: 20rpx;
    font-size: 28rpx;
    background-color: #f9f9f9;
    border-radius: 8rpx;
  }

  .word-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #999;
  }

  /* 底部操作栏 */
  .action-bar {
    height: 120rpx;
    padding: 20rpx 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

    .submit-btn {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #fff;
      background-color: #27ba9b;
      border-radius: 40rpx;

      &[disabled] {
        opacity: 0.6;
      }
    }
  }
}
</style>
