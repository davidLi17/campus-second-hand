<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/stores/member'
import { goodsApi } from '@/api/user_goods'
import { uploadFileAPI } from '@/api/upload'
import { categoryApi } from '@/api/category1'

const memberStore = useMemberStore()

// 路由参数
const routeParams = ref<{ id?: string }>({})

// 表单数据
const formData = ref({
  id: undefined as number | undefined,
  name: '',
  categoryId: undefined as number | undefined,
  price: '',
  desc: '',
  picture: '',
  pictures: [] as string[],
  status: 1, // 默认上架状态
})

// 是否是编辑模式
const isEditMode = computed(() => !!routeParams.value.id)

// 页面标题
const pageTitle = computed(() => (isEditMode.value ? '编辑商品' : '发布闲置'))

// 分类数据
const categories = ref<{ id: number; name: string }[]>([])

// 加载分类数据
const loadCategories = async () => {
  try {
    const res = await categoryApi.getAll()
    categories.value = res.data
  } catch (error) {
    console.error('加载分类失败:', error)
    uni.showToast({ title: '加载分类失败', icon: 'none' })
  }
}

// 加载商品详情
const loadGoodDetail = async (id: number) => {
  try {
    const res = await goodsApi.getById(id)
    const good = res.data
    formData.value = {
      id: good.id,
      name: good.name,
      categoryId: good.categoryId,
      price: good.price.toString(),
      desc: good.desc,
      picture: good.picture,
      pictures: good.pictures || [],
      status: good.status,
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
    uni.showToast({ title: '加载商品失败', icon: 'none' })
  }
}

// 上传状态
const uploadProgress = ref(0)
const isUploading = ref(false)

// 上传图片
const handleUpload = async () => {
  if (isUploading.value) return

  try {
    isUploading.value = true
    uploadProgress.value = 0

    const chooseRes = await uni.chooseImage({
      count: 9 - formData.value.pictures.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    })

    if (!chooseRes.tempFilePaths || chooseRes.tempFilePaths.length === 0) {
      throw new Error('未选择图片')
    }

    for (const filePath of chooseRes.tempFilePaths) {
      const fileInfo = await new Promise<UniApp.GetFileInfoSuccess>((resolve) => {
        uni.getFileInfo({
          filePath,
          success: resolve,
          fail: () => resolve({ size: Infinity } as any),
        })
      })

      if (fileInfo.size > 10 * 1024 * 1024) {
        throw new Error('图片大小不能超过10MB')
      }

      const compressedPath = await new Promise<string>((resolve) => {
        uni.compressImage({
          src: filePath,
          quality: 70,
          success: (res) => resolve(res.tempFilePath),
          fail: () => resolve(filePath),
        })
      })

      const uploadRes = await uploadFileAPI(compressedPath, (progress) => {
        uploadProgress.value = progress
      })

      formData.value.pictures.push(uploadRes.data)

      if (!formData.value.picture) {
        formData.value.picture = uploadRes.data
      }
    }

    uni.showToast({ title: '上传成功', icon: 'success' })
  } catch (error: any) {
    console.error('上传失败:', error)
    uni.showToast({
      title: error.message || '上传失败',
      icon: 'none',
    })
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
  }
}

// 删除图片
const removeImage = (index: number) => {
  if (formData.value.picture === formData.value.pictures[index]) {
    formData.value.picture = formData.value.pictures[0] || ''
  }
  formData.value.pictures.splice(index, 1)
}

// 设置主图
const setMainImage = (url: string) => {
  formData.value.picture = url
}

// 表单验证
const validateForm = () => {
  if (!formData.value.name.trim()) {
    uni.showToast({ title: '请输入商品名称', icon: 'none' })
    return false
  }
  if (!formData.value.categoryId) {
    uni.showToast({ title: '请选择商品分类', icon: 'none' })
    return false
  }
  if (!formData.value.price || isNaN(Number(formData.value.price))) {
    uni.showToast({ title: '请输入有效的价格', icon: 'none' })
    return false
  }
  if (formData.value.pictures.length === 0) {
    uni.showToast({ title: '请至少上传一张图片', icon: 'none' })
    return false
  }
  return true
}

// 提交表单
const submitForm = async () => {
  if (!validateForm()) return

  const submitData = {
    ...formData.value,
    price: Number(formData.value.price),
    sellerId: memberStore.profile?.id,
  }

  uni.showLoading({ title: '提交中...' })
  try {
    if (isEditMode.value) {
      await goodsApi.updateGood(submitData)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      await goodsApi.addGood(submitData)
      uni.showToast({ title: '发布成功', icon: 'success' })
    }
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('提交失败:', error)
    uni.showToast({
      title: isEditMode.value ? '修改失败' : '发布失败',
      icon: 'error',
    })
  } finally {
    uni.hideLoading()
  }
}

// 初始化
onLoad((params) => {
  routeParams.value = params
  if (params.id) {
    loadGoodDetail(Number(params.id))
  }
  loadCategories()
})
</script>

<template>
  <view class="publish-page">
    <!-- 顶部导航 -->
    <view class="page-header">
      <text class="header-title">{{ pageTitle }}</text>
    </view>

    <!-- 表单内容 -->
    <scroll-view class="form-content" scroll-y>
      <!-- 图片上传区域 -->
      <view class="upload-area">
        <text class="section-title">商品图片</text>
        <text class="section-subtitle">(最多9张，第一张为主图)</text>

        <view class="image-grid">
          <view
            v-for="(img, index) in formData.pictures"
            :key="index"
            class="image-box"
            :class="{ 'main-image': img === formData.picture }"
          >
            <image class="preview-image" :src="img" mode="aspectFill" @click="setMainImage(img)" />
            <view class="image-overlay" @click.stop="removeImage(index)">
              <uni-icons type="close" size="18" color="#fff" />
            </view>
            <view v-if="img === formData.picture" class="main-label">主图</view>
          </view>

          <view class="upload-box" @click="handleUpload" v-if="formData.pictures.length < 9">
            <view class="upload-icon">
              <uni-icons type="plusempty" size="28" color="#888" />
            </view>
            <text class="upload-text">添加图片</text>
          </view>
        </view>

        <view class="upload-progress" v-if="isUploading">
          <progress
            :percent="uploadProgress"
            activeColor="#4a8cff"
            backgroundColor="#f0f4ff"
            stroke-width="4"
          />
          <text class="progress-text">上传中 {{ uploadProgress }}%</text>
        </view>
      </view>

      <!-- 商品信息表单 -->
      <view class="form-section">
        <text class="section-title">商品信息</text>

        <view class="form-row">
          <text class="form-label">商品名称</text>
          <input
            class="form-input"
            v-model="formData.name"
            placeholder="请输入商品名称"
            placeholder-class="placeholder"
            maxlength="30"
          />
          <text class="word-count">{{ formData.name.length }}/30</text>
        </view>

        <view class="form-row">
          <text class="form-label">商品分类</text>
          <picker
            class="form-picker"
            mode="selector"
            :range="categories"
            range-key="name"
            @change="(e) => (formData.categoryId = categories[e.detail.value].id)"
          >
            <view class="picker-content">
              <text v-if="formData.categoryId" class="selected-value">
                {{ categories.find((c) => c.id === formData.categoryId)?.name }}
              </text>
              <text v-else class="placeholder">请选择分类</text>
              <uni-icons type="arrowright" size="16" color="#999" />
            </view>
          </picker>
        </view>

        <view class="form-row">
          <text class="form-label">出售价格</text>
          <view class="price-input">
            <text class="currency-symbol">¥</text>
            <input
              class="form-input"
              v-model="formData.price"
              type="digit"
              placeholder="0.00"
              placeholder-class="placeholder"
            />
          </view>
        </view>
      </view>

      <!-- 商品描述 -->
      <view class="form-section">
        <text class="section-title">商品描述</text>
        <textarea
          class="description-box"
          v-model="formData.desc"
          placeholder="详细描述商品的新旧程度、使用情况等"
          placeholder-class="placeholder"
          maxlength="500"
        />
        <view class="description-footer">
          <text class="word-count">{{ formData.desc.length }}/500</text>
          <text class="description-tip">详细的描述有助于更快售出</text>
        </view>
      </view>
    </scroll-view>

    <!-- 底部操作栏 -->
    <view class="action-bar">
      <button
        class="submit-button"
        @click="submitForm"
        :disabled="isUploading || !formData.pictures.length"
      >
        <text>{{ isEditMode ? '保存修改' : '发布商品' }}</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.publish-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.page-header {
  padding: 30rpx 40rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f4ff;

  .header-title {
    font-size: 36rpx;
    font-weight: 500;
    color: #333;
  }
}

.form-content {
  flex: 1;
  padding: 30rpx;
}

.upload-area {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(74, 140, 255, 0.06);

  .section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 8rpx;
  }

  .section-subtitle {
    font-size: 24rpx;
    color: #888;
    margin-bottom: 30rpx;
  }
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .image-box {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background-color: #f8fafc;

    &.main-image {
      border: 2rpx solid #4a8cff;
    }

    .preview-image {
      width: 100%;
      height: 100%;
    }

    .image-overlay {
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

    .main-label {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      font-size: 24rpx;
      color: #fff;
      background-color: rgba(74, 140, 255, 0.8);
    }
  }

  .upload-box {
    width: 200rpx;
    height: 200rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 2rpx dashed #ddd;
    border-radius: 12rpx;
    background-color: #f8fafc;

    .upload-icon {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
      background-color: #f0f4ff;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 16rpx;
    }

    .upload-text {
      font-size: 26rpx;
      color: #666;
    }
  }
}

.upload-progress {
  margin-top: 30rpx;

  progress {
    width: 100%;
  }

  .progress-text {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #4a8cff;
    margin-top: 10rpx;
  }
}

.form-section {
  margin-bottom: 40rpx;
  padding: 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(74, 140, 255, 0.06);

  .section-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 30rpx;
  }
}

.form-row {
  margin-bottom: 40rpx;
  position: relative;

  &:last-child {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-size: 28rpx;
    color: #555;
    margin-bottom: 20rpx;
  }

  .form-input {
    width: 100%;
    height: 80rpx;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: #333;
    background-color: #f8fafc;
    border-radius: 8rpx;
  }

  .word-count {
    display: block;
    text-align: right;
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
  }
}

.form-picker {
  .picker-content {
    width: 100%;
    height: 80rpx;
    padding: 0 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f8fafc;
    border-radius: 8rpx;

    .selected-value {
      color: #333;
    }

    .placeholder {
      color: #ccc;
    }
  }
}

.price-input {
  display: flex;
  align-items: center;

  .currency-symbol {
    font-size: 32rpx;
    color: #4a8cff;
    margin-right: 16rpx;
  }
}

.description-box {
  width: 100%;
  height: 240rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f8fafc;
  border-radius: 8rpx;
  margin-bottom: 10rpx;
}

.description-footer {
  display: flex;
  justify-content: space-between;

  .description-tip {
    font-size: 24rpx;
    color: #4a8cff;
  }
}

.action-bar {
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-top: 1rpx solid #f0f4ff;

  .submit-button {
    height: 90rpx;
    line-height: 90rpx;
    font-size: 32rpx;
    color: #fff;
    background-color: #4a8cff;
    border-radius: 45rpx;

    &[disabled] {
      background-color: #c0d4ff;
    }
  }
}

.placeholder {
  color: #ccc;
}
</style>
