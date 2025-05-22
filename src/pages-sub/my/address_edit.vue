<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addressApi } from '@/api/address'
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()

// 表单数据
const formData = ref({
  id: undefined as number | undefined,
  consignee: '',
  phone: '',
  provinceName: '',
  cityName: '',
  districtName: '',
  detail: '',
  label: '',
  isDefault: 0,
})

// 表单验证规则
const rules = {
  consignee: { required: true, message: '请输入收货人姓名', trigger: 'blur' },
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  detail: { required: true, message: '请输入详细地址', trigger: 'blur' },
  provinceName: { required: true, message: '请选择所在地区', trigger: 'change' },
}

// 加载状态
const loading = ref(false)
const submitting = ref(false)

// 页面加载
onLoad((query: { id?: string }) => {
  if (query.id) {
    loadAddress(parseInt(query.id))
  }
})

// 加载地址详情
const loadAddress = async (id: number) => {
  try {
    loading.value = true
    const res = await addressApi.getAllAddresses()
    const address = res.data.find((item) => item.id === id)
    if (address) {
      formData.value = {
        id: address.id,
        consignee: address.consignee,
        phone: address.phone,
        provinceName: address.provinceName,
        cityName: address.cityName,
        districtName: address.districtName,
        detail: address.detail,
        label: address.label || '',
        isDefault: address.isDefault || 0,
      }
    }
  } catch (error) {
    console.error('加载地址失败:', error)
    uni.showToast({ title: '加载地址失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 地区选择变化
const onRegionChange = (e: any) => {
  const value = e.detail.value
  formData.value.provinceName = value[0]
  formData.value.cityName = value[1]
  formData.value.districtName = value[2]
}

// 提交表单
const submitForm = async () => {
  try {
    submitting.value = true

    // 验证必填字段
    if (
      !formData.value.consignee ||
      !formData.value.phone ||
      !formData.value.detail ||
      !formData.value.provinceName
    ) {
      uni.showToast({ title: '请填写完整地址信息', icon: 'none' })
      return
    }

    // 手机号格式验证
    if (!/^1[3-9]\d{9}$/.test(formData.value.phone)) {
      uni.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }

    const addressData = {
      ...formData.value,
      userId: memberStore.profile?.id,
    }

    if (formData.value.id) {
      // 更新地址
      await addressApi.updateAddress(addressData)
      uni.showToast({ title: '修改成功', icon: 'success' })
    } else {
      // 新增地址
      await addressApi.addAddress(addressData)
      uni.showToast({ title: '添加成功', icon: 'success' })
    }

    // 返回上一页
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('保存地址失败:', error)
    uni.showToast({ title: '保存失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

// 返回上一页
const goBack = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="address-edit-page">
    <!-- 导航栏 -->
    <view class="nav-bar">
      <view class="nav-back" @click="goBack">
        <uni-icons type="arrowleft" size="24" color="#333"></uni-icons>
      </view>
      <text class="nav-title">{{ formData.id ? '编辑地址' : '新增地址' }}</text>
      <view class="nav-right"></view>
    </view>

    <!-- 表单内容 -->
    <scroll-view scroll-y class="form-content">
      <uni-forms :model="formData" :rules="rules">
        <!-- 收货人 -->
        <uni-forms-item label="收货人" name="consignee">
          <uni-easyinput
            v-model="formData.consignee"
            placeholder="请输入收货人姓名"
            :inputBorder="false"
          />
        </uni-forms-item>

        <!-- 手机号 -->
        <uni-forms-item label="手机号" name="phone">
          <uni-easyinput
            v-model="formData.phone"
            placeholder="请输入收货人手机号"
            type="number"
            maxlength="11"
            :inputBorder="false"
          />
        </uni-forms-item>

        <!-- 所在地区 -->
        <uni-forms-item label="所在地区" name="provinceName">
          <picker
            mode="region"
            @change="onRegionChange"
            :value="[formData.provinceName, formData.cityName, formData.districtName]"
          >
            <view class="picker">
              <text v-if="formData.provinceName">
                {{ formData.provinceName }}{{ formData.cityName }}{{ formData.districtName }}
              </text>
              <text v-else class="placeholder">请选择省市区</text>
              <uni-icons type="forward" size="18" color="#999"></uni-icons>
            </view>
          </picker>
        </uni-forms-item>

        <!-- 详细地址 -->
        <uni-forms-item label="详细地址" name="detail">
          <uni-easyinput
            v-model="formData.detail"
            placeholder="请输入街道、楼牌号等详细地址"
            :inputBorder="false"
          />
        </uni-forms-item>

        <!-- 地址标签 -->
        <uni-forms-item label="地址标签" name="label">
          <uni-easyinput
            v-model="formData.label"
            placeholder="如：家、公司、学校（选填）"
            :inputBorder="false"
          />
        </uni-forms-item>

        <!-- 设为默认 -->
        <view class="default-switch">
          <text class="switch-label">设为默认地址</text>
          <switch
            :checked="formData.isDefault === 1"
            @change="(e) => (formData.isDefault = e.detail.value ? 1 : 0)"
            color="#27ba9b"
          />
        </view>
      </uni-forms>
    </scroll-view>

    <!-- 底部按钮 -->
    <view class="action-bar">
      <button class="submit-btn" :loading="submitting" @click="submitForm">
        {{ formData.id ? '保存修改' : '保存地址' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.address-edit-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
}

.nav-bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  background-color: #fff;
  position: relative;
  z-index: 10;

  .nav-back {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-title {
    font-size: 34rpx;
    font-weight: 500;
    color: #333;
  }

  .nav-right {
    width: 40rpx;
  }
}

.form-content {
  flex: 1;
  padding: 20rpx 30rpx;
  background-color: #fff;
  margin-top: 20rpx;

  :deep(.uni-forms-item) {
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
  }

  :deep(.uni-forms-item__label) {
    width: 160rpx !important;
    font-size: 30rpx;
    color: #333;
  }

  :deep(.uni-easyinput__content) {
    border: none !important;
    background-color: transparent !important;
  }

  .picker {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 30rpx;
    color: #333;

    .placeholder {
      color: #999;
    }
  }

  .default-switch {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100rpx;
    padding: 0 20rpx;

    .switch-label {
      font-size: 30rpx;
      color: #333;
    }
  }
}

.action-bar {
  height: 120rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);

  .submit-btn {
    height: 80rpx;
    line-height: 80rpx;
    background-color: #27ba9b;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
  }
}
</style>
