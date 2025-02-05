<template>
  <div class="skeleton-home">
    <!-- 顶部导航骨架 -->
    <div class="skeleton-nav">
      <div class="skeleton-logo"></div>
      <div class="skeleton-search"></div>
      <div class="skeleton-cart"></div>
    </div>
    
    <!-- 商品列表骨架 -->
    <div class="skeleton-products">
      <div v-for="i in 6" :key="i" class="skeleton-product-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-price"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// [PATTERN] 占位符模式 - 提供加载状态的视觉反馈
// [PERF] 减少首屏加载时的布局偏移
</script>

<style scoped>
.skeleton-home {
  padding: 20px;
}

/* [PERF] 使用纯 CSS 实现骨架屏动画，减少 JavaScript 开销 */
@keyframes skeleton-loading {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

.skeleton-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  padding: 10px;
}

.skeleton-logo,
.skeleton-search,
.skeleton-cart,
.skeleton-image,
.skeleton-title,
.skeleton-price {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

.skeleton-logo {
  width: 120px;
  height: 40px;
  border-radius: 4px;
}

.skeleton-search {
  flex: 1;
  height: 40px;
  border-radius: 20px;
}

.skeleton-cart {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.skeleton-products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
}

.skeleton-product-card {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.skeleton-title {
  height: 20px;
  width: 80%;
  border-radius: 4px;
  margin-bottom: 10px;
}

.skeleton-price {
  height: 24px;
  width: 40%;
  border-radius: 4px;
}
</style>
