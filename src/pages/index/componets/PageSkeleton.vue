<script setup lang="ts">
//
</script>
<template name="skeleton">
  <view class="sk-container">
    <view class="index">
      <scroll-view
        refresher-enabled="true"
        scroll-y="true"
        class="scroll-view"
        enable-back-to-top="true"
      >
        <view>
          <view is="pages/index/componets/CustomNavbar"></view>
          <view is="components/XtxSwiper">
            <view class="carousel XtxSwiper--carousel">
              <swiper circular="true" interval="3000" current="0" autoplay="false">
                <swiper-item
                  style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    transform: translate(0%, 0px) translateZ(0px);
                  "
                >
                  <navigator class="navigator XtxSwiper--navigator" hover-class="none">
                    <image class="image XtxSwiper--image sk-image" mode="aspectFill"></image>
                  </navigator>
                </swiper-item>
              </swiper>
              <view class="indicator XtxSwiper--indicator">
                <text class="dot XtxSwiper--dot active XtxSwiper--active"></text>
                <text class="dot XtxSwiper--dot"></text>
                <text class="dot XtxSwiper--dot"></text>
                <text class="dot XtxSwiper--dot"></text>
                <text class="dot XtxSwiper--dot"></text>
              </view>
            </view>
          </view>
          <view is="pages/index/componets/CategoryPanel">
            <view class="category CategoryPanel--category">
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-914 sk-text"
                  >居家</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-684 sk-text"
                  >锦鲤</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-807 sk-text"
                  >服饰</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-885 sk-text"
                  >母婴</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-923 sk-text"
                  >个护</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-456 sk-text"
                  >严选</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-731 sk-text"
                  >数码</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-918 sk-text"
                  >运动</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-216 sk-text"
                  >杂项</text
                >
              </navigator>
              <navigator class="category-item CategoryPanel--category-item" hover-class="none">
                <image class="icon CategoryPanel--icon sk-image"></image>
                <text class="text CategoryPanel--text sk-transparent sk-text-14-2857-333 sk-text"
                  >品牌</text
                >
              </navigator>
            </view>
          </view>
          <view is="pages/index/componets/HotPanel">
            <view class="panel HotPanel--panel hot HotPanel--hot">
              <view class="item HotPanel--item">
                <view class="title HotPanel--title">
                  <text
                    class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-653 sk-text"
                    >特惠推荐</text
                  >
                  <text
                    class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-605 sk-text"
                    >精选全攻略</text
                  >
                </view>
                <navigator class="cards HotPanel--cards" hover-class="none">
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                </navigator>
              </view>
              <view class="item HotPanel--item">
                <view class="title HotPanel--title">
                  <text
                    class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-414 sk-text"
                    >爆款推荐</text
                  >
                  <text
                    class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-513 sk-text"
                    >最受欢迎</text
                  >
                </view>
                <navigator class="cards HotPanel--cards" hover-class="none">
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                </navigator>
              </view>
              <view class="item HotPanel--item">
                <view class="title HotPanel--title">
                  <text
                    class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-480 sk-text"
                    >一站买全</text
                  >
                  <text
                    class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-379 sk-text"
                    >精心优选</text
                  >
                </view>
                <navigator class="cards HotPanel--cards" hover-class="none">
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                </navigator>
              </view>
              <view class="item HotPanel--item">
                <view class="title HotPanel--title">
                  <text
                    class="title-text HotPanel--title-text sk-transparent sk-text-14-2857-2 sk-text"
                    >新鲜好物</text
                  >
                  <text
                    class="title-desc HotPanel--title-desc sk-transparent sk-text-14-2857-357 sk-text"
                    >生活加分项</text
                  >
                </view>
                <navigator class="cards HotPanel--cards" hover-class="none">
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                  <image class="image HotPanel--image sk-image" mode="aspectFit"></image>
                </navigator>
              </view>
            </view>
          </view>
          <scroll-view scroll-y="true">
            <view is="components/XtxGuess" class="r">
              <view class="caption XtxGuess--caption">
                <text
                  class="text XtxGuess--text sk-transparent sk-text-0-0000-9 sk-text sk-pseudo sk-pseudo-circle"
                  >猜你喜欢</text
                >
              </view>
              <view class="guess XtxGuess--guess">
                <navigator class="guess-item XtxGuess--guess-item">
                  <image class="image XtxGuess--image sk-image" mode="aspectFill"></image>
                </navigator>
                <navigator class="guess-item XtxGuess--guess-item">
                  <image class="image XtxGuess--image sk-image" mode="aspectFill"></image>
                </navigator>
              </view>
            </view>
          </scroll-view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<style scoped>
.sk-transparent {
  color: transparent !important;
}
.sk-text-14-2857-914 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text {
  background-origin: content-box !important;
  background-clip: content-box !important;
  background-color: transparent !important;
  color: transparent !important;
  background-repeat: repeat-y !important;
}
.sk-text-14-2857-684 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-807 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-885 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-923 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-456 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-731 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-918 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-216 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-333 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 35rpx;
  position: relative !important;
}
.sk-text-14-2857-653 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 43.0769rpx;
  position: relative !important;
}
.sk-text-14-2857-605 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.3077rpx;
  position: relative !important;
}
.sk-text-14-2857-414 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 43.0769rpx;
  position: relative !important;
}
.sk-text-14-2857-513 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.3077rpx;
  position: relative !important;
}
.sk-text-14-2857-480 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 43.0769rpx;
  position: relative !important;
}
.sk-text-14-2857-379 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.3077rpx;
  position: relative !important;
}
.sk-text-14-2857-2 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 43.0769rpx;
  position: relative !important;
}
.sk-text-14-2857-357 {
  background-image: linear-gradient(
    transparent 14.2857%,
    #eeeeee 0%,
    #eeeeee 85.7143%,
    transparent 0%
  ) !important;
  background-size: 100% 32.3077rpx;
  position: relative !important;
}
.sk-text-0-0000-9 {
  background-image: linear-gradient(
    transparent 0%,
    #eeeeee 0%,
    #eeeeee 100%,
    transparent 0%
  ) !important;
  background-size: 100% 30.7692rpx;
  position: relative !important;
}
.sk-image {
  background: #efefef !important;
}
.sk-pseudo::before,
.sk-pseudo::after {
  background: #efefef !important;
  background-image: none !important;
  color: transparent !important;
  border-color: transparent !important;
}
.sk-pseudo-rect::before,
.sk-pseudo-rect::after {
  border-radius: 0 !important;
}
.sk-pseudo-circle::before,
.sk-pseudo-circle::after {
  border-radius: 50% !important;
}
.sk-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: transparent;
}
</style>
