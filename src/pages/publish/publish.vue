<script setup lang="ts">
import { ref } from 'vue'
import { uploadFileAPI } from '@/api/upload'
import { addGoodsAPI } from '@/api/goods'

// 表单数据
const formData = ref({
  categoryId: 0,
  name: '',
  desc: '',
  picture: '',
  pictures: [] as string[],
  price: 0,
  status: 0, // 0-在售 1-已售 2-下架
})

// 分类选项
const categories = ref([
  { id: 1, name: '教材书籍' },
  { id: 2, name: '数码电子' },
  { id: 3, name: '生活用品' },
  { id: 4, name: '服饰鞋包' },
  { id: 5, name: '运动器材' },
  { id: 6, name: '其他' },
])

// 上传状态
const isUploading = ref(false)
const uploadProgress = ref(0)

// 上传图片
const uploadImage = async () => {
  try {
    const res = await uni.chooseImage({
      count: 9 - formData.value.pictures.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    isUploading.value = true
    uploadProgress.value = 0

    const tempFiles = res.tempFiles
    const uploadedUrls: string[] = []

    for (const file of tempFiles) {
      const uploadRes = await uploadFileAPI(file.path, (progress) => {
        uploadProgress.value = progress
      })
      uploadedUrls.push(uploadRes.url)
    }

    // 第一张图作为主图
    if (!formData.value.picture && uploadedUrls.length > 0) {
      formData.value.picture = uploadedUrls[0]
    }

    formData.value.pictures = [...formData.value.pictures, ...uploadedUrls]
  } catch (error) {
    uni.showToast({ title: error.message || '上传失败', icon: 'none' })
  } finally {
    isUploading.value = false
  }
}

// 移除图片
const removeImage = (index: number) => {
  formData.value.pictures.splice(index, 1)
  // 如果移除的是主图，重新设置主图
  if (
    formData.value.picture === formData.value.pictures[index] &&
    formData.value.pictures.length > 0
  ) {
    formData.value.picture = formData.value.pictures[0]
  } else if (formData.value.pictures.length === 0) {
    formData.value.picture = ''
  }
}

// 设置主图
const setMainImage = (url: string) => {
  formData.value.picture = url
}

// 表单验证
const validateForm = () => {
  if (!formData.value.name) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return false
  }

  if (!formData.value.categoryId) {
    uni.showToast({ title: '请选择商品分类', icon: 'none' })
    return false
  }

  if (!formData.value.price || formData.value.price <= 0) {
    uni.showToast({ title: '请输入合理的价格', icon: 'none' })
    return false
  }

  if (!formData.value.picture) {
    uni.showToast({ title: '请至少上传一张图片', icon: 'none' })
    return false
  }

  return true
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return

  try {
    uni.showLoading({ title: '发布中...' })

    const res = await addGoodsAPI({
      ...formData.value,
      sellerId: uni.getStorageSync('userId') || 0, // 从缓存获取用户ID
    })

    uni.hideLoading()
    uni.showToast({ title: '发布成功' })

    // 发布成功后返回首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
  } catch (error) {
    uni.hideLoading()
    uni.showToast({ title: error.message || '发布失败', icon: 'none' })
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
        <text class="section-tip">(第一张将作为主图)</text>

        <view class="image-uploader">
          <!-- 已上传图片 -->
          <view
            class="image-item"
            v-for="(url, index) in pictures"
            :key="index"
            :class="{ 'main-image': url === formData.picture }"
          >
            <image class="image" :src="url" mode="aspectFill" @click="setMainImage(url)" />
            <view class="image-remove" @click.stop="removeImage(index)">
              <uni-icons type="closeempty" size="18" color="#fff" />
            </view>
            <view v-if="url === formData.picture" class="main-tag">主图</view>
          </view>

          <!-- 上传按钮 -->
          <view class="upload-btn" @click="uploadImage" v-if="formData.pictures.length < 9">
            <uni-icons type="plusempty" size="40" color="#ccc" />
            <text class="upload-text">添加图片</text>
          </view>
        </view>

        <!-- 上传进度 -->
        <view class="upload-progress" v-if="isUploading">
          <progress :percent="uploadProgress" stroke-width="4" activeColor="#27ba9b" />
          <text class="progress-text">{{ uploadProgress }}%</text>
        </view>
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
      <button class="submit-btn" @click="submitForm">发布商品</button>
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

  .upload-progress {
    display: flex;
    align-items: center;
    margin-top: 20rpx;

    progress {
      flex: 1;
    }

    .progress-text {
      font-size: 24rpx;
      color: #666;
      margin-left: 20rpx;
    }
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
    }
  }
}
</style>
