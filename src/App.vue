<template>
  <div class="app">
    <!-- 顶部导航 -->
    <nav class="nav">
      <div class="logo">SwiftCart</div>
      <div class="search">
        <input 
          type="text" 
          placeholder="搜索商品..." 
          v-model="searchQuery"
          @input="handleSearch"
        >
      </div>
      <div class="cart-wrapper" @click="showCart">
        <div class="cart">
          <span class="cart-icon">🛒</span>
          <span class="cart-count" v-if="cartCount">{{ cartCount }}</span>
        </div>
      </div>
    </nav>

    <!-- [PATTERN] Suspense异步加载 + 骨架屏 -->
    <Suspense>
      <template #default>
        <ProductList @show-modal="showProductModal" />
      </template>
      <template #fallback>
        <SkeletonHome />
      </template>
    </Suspense>

    <!-- 商品详情弹窗 -->
    <ModalManager ref="modalManager" v-model:visible="isProductModalVisible">
      <template v-if="selectedProduct">
        <div class="product-detail">
          <div class="product-image-wrapper">
            <img :src="selectedProduct.image" :alt="selectedProduct.name">
          </div>
          <div class="product-info">
            <h2>{{ selectedProduct.name }}</h2>
            <p class="price">¥{{ selectedProduct.price.toFixed(2) }}</p>
            <p class="description">{{ selectedProduct.description }}</p>
            <div class="action-buttons">
              <button class="add-to-cart" @click="addToCart(selectedProduct)">
                加入购物车
              </button>
              <button class="buy-now" @click="buyNow(selectedProduct)">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </template>
    </ModalManager>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalManager from './components/ModalManager.vue'
import ProductList from './components/ProductList.vue'
import SkeletonHome from './components/SkeletonHome.vue'

/**
 * [CONCEPT] 状态管理
 * 在实际项目中，这些状态应该放在 Pinia/Vuex 中统一管理
 */
const searchQuery = ref('')
const cartCount = ref(0)
const modalManager = ref(null)
const selectedProduct = ref(null)

// [PATTERN] 防抖搜索
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    console.log('搜索:', searchQuery.value)
    // TODO: 实现搜索逻辑
  }, 300)
}

// 显示商品详情
const showProductModal = (product) => {
  selectedProduct.value = product
  modalManager.value?.show(product.name)
}

// 购物车相关操作
const addToCart = (product) => {
  cartCount.value++
  console.log('添加到购物车:', product)
  modalManager.value?.close()
}

const showCart = () => {
  console.log('显示购物车')
  // TODO: 实现购物车展示逻辑
}

const buyNow = (product) => {
  console.log('立即购买:', product)
  modalManager.value?.close()
  // TODO: 实现购买逻辑
}
</script>

<style>
/* [PERF] 使用CSS变量方便主题定制 */
:root {
  --primary-color: #4CAF50;
  --text-color: #333;
  --border-color: #ddd;
  --hover-color: #45a049;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  background: #f5f5f5;
  color: var(--text-color);
}

/* 导航栏样式 */
.nav {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: var(--primary-color);
  margin-right: 30px;
}

.search {
  flex: 1;
  margin: 0 20px;
}

.search input {
  width: 100%;
  padding: 10px 20px;
  border: 1px solid var(--border-color);
  border-radius: 20px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.cart-wrapper {
  position: relative;
  cursor: pointer;
}

.cart {
  padding: 8px;
}

.cart-icon {
  font-size: 24px;
}

.cart-count {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

/* 商品详情样式 */
.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

.product-image-wrapper {
  border-radius: 8px;
  overflow: hidden;
}

.product-image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-info h2 {
  margin-bottom: 15px;
  color: var(--text-color);
}

.price {
  font-size: 24px;
  color: #ff6b6b;
  margin-bottom: 15px;
}

.description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: auto;
}

.action-buttons button {
  padding: 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

.add-to-cart {
  background: #fff;
  border: 1px solid var(--primary-color) !important;
  color: var(--primary-color);
}

.add-to-cart:hover {
  background: #f0f0f0;
}

.buy-now {
  background: var(--primary-color);
  color: white;
}

.buy-now:hover {
  background: var(--hover-color);
}

/* [PERF] 响应式布局 */
@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }
  
  .nav {
    padding: 10px;
  }
  
  .logo {
    font-size: 20px;
    margin-right: 15px;
  }
  
  .search input {
    padding: 8px 15px;
  }
}

/* [PERF] 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  :root {
    --text-color: #f0f0f0;
    --border-color: #444;
  }
  
  body {
    background: #1a1a1a;
  }
  
  .nav {
    background: #222;
  }
  
  .search input {
    background: #333;
    color: #fff;
  }
  
  .product-detail {
    background: #222;
  }
}
</style>
