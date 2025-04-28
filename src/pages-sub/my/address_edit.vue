<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 表单数据
const formData = ref({
  id: 0,
  consignee: '',
  phone: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  detail: '',
  isDefault: 0,
  label: '',
})

// 地区选择器
const region = ref<string[]>([])
const showRegionPicker = ref(false)

// 页面加载
onLoad((options) => {
  if (options.id) {
    // 编辑模式，获取地址详情
    // fetchAddressDetail(options.id)
    // 模拟数据
    formData.value = {
      id: 1,
      consignee: '张三',
      phone: '13800138000',
      provinceName: '北京市',
      cityName: '北京市',
      districtName: '朝阳区',
      detail: '建国路88号SOHO现代城A座',
      isDefault: 1,
      label: '公司',
    }
    region.value = [
      formData.value.provinceName,
      formData.value.cityName,
      formData.value.districtName,
    ]
  }
})

// 地区选择变化
const onRegionChange = (e: any) => {
  region.value = e.detail.value
  formData.value.provinceName = e.detail.value[0]
  formData.value.cityName = e.detail.value[1]
  formData.value.districtName = e.detail.value[2]
}

// 保存地址
const saveAddress = () => {
  if (!formData.value.consignee) {
    uni.showToast({ title: '请输入收货人姓名', icon: 'none' })
    return
  }

  if (!formData.value.phone) {
    uni.showToast({ title: '请输入手机号码', icon: 'none' })
    return
  }

  if (!formData.value.detail) {
    uni.showToast({ title: '请输入详细地址', icon: 'none' })
    return
  }

  // 这里应该调用API保存地址
  // saveAddressAPI(formData.value)

  uni.showToast({ title: '保存成功' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1500)
}
</script>

<template>
  <view class="edit-page">
    <view class="form-container">
      <!-- 收货人 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input class="input" v-model="formData.consignee" placeholder="请输入收货人姓名" />
      </view>

      <!-- 手机号码 -->
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          class="input"
          v-model="formData.phone"
          placeholder="请输入手机号码"
          type="number"
          maxlength="11"
        />
      </view>

      <!-- 所在地区 -->
      <view class="form-item" @click="showRegionPicker = true">
        <text class="label">所在地区</text>
        <view class="input">
          <text v-if="region.length > 0">{{ region.join(' ') }}</text>
          <text v-else class="placeholder">请选择所在地区</text>
        </view>
        <uni-icons type="arrowright" size="16" color="#999" />
      </view>

      <!-- 详细地址 -->
      <view class="form-item">
        <text class="label">详细地址</text>
        <input class="input" v-model="formData.detail" placeholder="请输入详细地址" />
      </view>

      <!-- 地址标签 -->
      <view class="form-item">
        <text class="label">地址标签</text>
        <input class="input" v-model="formData.label" placeholder="例如：家、公司、学校" />
      </view>

      <!-- 设为默认 -->
      <view class="form-item switch-item">
        <text class="label">设为默认地址</text>
        <switch
          :checked="formData.isDefault === 1"
          @change="(e) => (formData.isDefault = e.detail.value ? 1 : 0)"
          color="#27ba9b"
        />
      </view>
    </view>

    <!-- 保存按钮 -->
    <view class="action-bar">
      <button class="save-btn" @click="saveAddress">保存</button>
    </view>

    <!-- 地区选择器 -->
    <uni-data-picker
      v-if="showRegionPicker"
      :localdata="regionData"
      popup-title="请选择所在地区"
      @change="onRegionChange"
      @maskClick="showRegionPicker = false"
    />
  </view>
</template>

<style lang="scss" scoped>
.edit-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;

  .form-container {
    flex: 1;
    padding: 20rpx;

    .form-item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      margin-bottom: 20rpx;
      background-color: #fff;
      border-radius: 16rpx;

      .label {
        width: 160rpx;
        font-size: 28rpx;
        color: #333;
      }

      .input {
        flex: 1;
        font-size: 28rpx;

        .placeholder {
          color: #999;
        }
      }

      &.switch-item {
        justify-content: space-between;
      }
    }
  }

  .action-bar {
    padding: 20rpx;
    background-color: #fff;

    .save-btn {
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
