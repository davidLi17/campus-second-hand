<!-- pages/common/webview.vue -->
<template>
  <web-view :src="url"></web-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const url = ref('')

onLoad((options) => {
  if (options.url) {
    url.value = decodeURIComponent(options.url)
  } else {
    uni.showToast({ title: '无效的链接', icon: 'none' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})
</script>
