<template>
  <div class="cart-container md-surface">
    <!-- 头部区域 -->
    <div class="header-section md-elevation-2 bg-primary rounded-t-xl p-24dp">
      <h2 class="display-small text-on-primary mb-8dp">购物车</h2>
      <p class="body-large text-on-primary/80">{{ cart.itemCount }} 件商品</p>
    </div>

    <!-- 列表区域 -->
    <md-list class="cart-items-list py-16dp">
      <div v-for="item in cart.items" 
           :key="item.id" 
           v-memo="[item.id, item.name, item.price, item.quantity]"
           class="cart-item-wrapper">
        <md-elevation></md-elevation>
        <div class="cart-item md-state-layer bg-surface-container rounded-lg mb-16dp mx-16dp overflow-hidden"
             @click="openItemDetail(item)">
          <!-- 商品信息 -->
          <div class="flex items-center p-16dp gap-16dp">
            <!-- 商品图片占位 -->
            <div class="w-64dp h-64dp rounded-lg bg-surface-variant flex items-center justify-center">
              <md-icon class="text-on-surface-variant">shopping_bag</md-icon>
            </div>
            
            <!-- 商品详情 -->
            <div class="flex-1">
              <h3 class="title-large text-on-surface mb-4dp">{{ item.name }}</h3>
              <p class="headline-medium text-primary mb-4dp">¥{{ item.price }}</p>
              
              <!-- 数量控制器 -->
              <div class="flex items-center gap-8dp mt-8dp" @click.stop>
                <md-filled-icon-button
                  @click="decrementQuantity(item.id)"
                  class="md-interactive"
                >
                  <md-icon>remove</md-icon>
                </md-filled-icon-button>
                
                <md-filled-text-field
                  type="number"
                  :value="quantities[item.id]"
                  @input="(e) => handleQuantityInput(item.id, e)"
                  class="w-72dp"
                  min="1"
                  density="compact"
                ></md-filled-text-field>
                
                <md-filled-icon-button
                  @click="incrementQuantity(item.id)"
                  class="md-interactive"
                >
                  <md-icon>add</md-icon>
                </md-filled-icon-button>
              </div>
            </div>

            <!-- 操作按钮 -->
            <md-filled-tonal-button
              @click.stop="confirmDelete(item)"
              class="md-interactive"
            >
              <md-icon slot="icon">delete</md-icon>
              删除
            </md-filled-tonal-button>
          </div>
        </div>
      </div>
    </md-list>

    <!-- 底部汇总区域 -->
    <div class="summary-section md-elevation-2 bg-surface-container-high rounded-b-xl p-24dp">
      <div class="flex justify-between items-center">
        <div>
          <p class="body-large text-on-surface-variant mb-4dp">总计</p>
          <p class="display-small text-primary">¥{{ cart.total }}</p>
        </div>
        
        <div class="flex gap-16dp">
          <md-filled-tonal-button
            v-if="cart.items.length > 0"
            @click="confirmClearCart"
            class="md-interactive"
          >
            <md-icon slot="icon">remove_shopping_cart</md-icon>
            清空购物车
          </md-filled-tonal-button>
          
          <md-filled-button
            @click="handleCheckout"
            class="md-interactive"
          >
            <md-icon slot="icon">shopping_cart_checkout</md-icon>
            结算
          </md-filled-button>
        </div>
      </div>
    </div>

    <!-- 商品详情弹窗 -->
    <ModalManager
      v-model:visible="showItemDetail"
      title="商品详情"
      :confirm-text="'关闭'"
      :show-cancel="false"
    >
      <div v-if="selectedItem" class="p-16dp">
        <div class="mb-16dp">
          <h3 class="headline-small mb-8dp">{{ selectedItem.name }}</h3>
          <p class="body-large text-primary">价格：¥{{ selectedItem.price }}</p>
          <p class="body-medium text-on-surface-variant">数量：{{ selectedItem.quantity }}</p>
        </div>
        <div class="body-medium text-on-surface-variant">
          商品详细描述...
        </div>
      </div>
    </ModalManager>

    <!-- 删除确认弹窗 -->
    <ModalManager
      v-model:visible="showDeleteConfirm"
      title="确认删除"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="handleRemove"
    >
      <p class="body-large">确定要删除这个商品吗？</p>
    </ModalManager>

    <!-- 清空购物车确认弹窗 -->
    <ModalManager
      v-model:visible="showClearConfirm"
      title="清空购物车"
      confirm-text="清空"
      cancel-text="取消"
      @confirm="handleClear"
    >
      <p class="body-large">确定要清空购物车吗？</p>
    </ModalManager>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import throttle from 'lodash/throttle'
import * as Sentry from "@sentry/vue"
import ModalManager from './ModalManager.vue'

// Material Web Components
import '@material/web/list/list'
import '@material/web/textfield/filled-text-field'
import '@material/web/button/filled-button'
import '@material/web/button/filled-tonal-button'
import '@material/web/icon/icon'
import '@material/web/iconbutton/filled-icon-button'
import '@material/web/elevation/elevation'

const cart = useCartStore()
const quantities = ref({})
const showItemDetail = ref(false)
const showDeleteConfirm = ref(false)
const showClearConfirm = ref(false)
const selectedItem = ref(null)
const itemToDelete = ref(null)

// 初始化数量
const initializeQuantities = () => {
  try {
    cart.items.forEach(item => {
      quantities.value[item.id] = item.quantity
    })
  } catch (error) {
    Sentry.captureException(error)
    console.error('初始化数量失败:', error)
  }
}

// 打开商品详情
const openItemDetail = (item) => {
  selectedItem.value = item
  showItemDetail.value = true
}

// 确认删除商品
const confirmDelete = (item) => {
  itemToDelete.value = item.id
  showDeleteConfirm.value = true
}

// 确认清空购物车
const confirmClearCart = () => {
  showClearConfirm.value = true
}

// 增加数量
const incrementQuantity = (id) => {
  const currentQuantity = quantities.value[id]
  handleQuantityInput(id, { target: { value: currentQuantity + 1 } })
}

// 减少数量
const decrementQuantity = (id) => {
  const currentQuantity = quantities.value[id]
  if (currentQuantity > 1) {
    handleQuantityInput(id, { target: { value: currentQuantity - 1 } })
  }
}

// 处理数量输入
const handleQuantityInput = throttle((id, event) => {
  try {
    const newQuantity = parseInt(event.target.value)
    if (newQuantity >= 1) {
      quantities.value[id] = newQuantity
      cart.updateItem(id, newQuantity)
    } else {
      quantities.value[id] = 1
    }
  } catch (error) {
    Sentry.captureException(error)
    console.error('更新数量失败:', error)
  }
}, 300)

// 处理删除
const handleRemove = () => {
  try {
    if (itemToDelete.value) {
      cart.removeItem(itemToDelete.value)
      itemToDelete.value = null
    }
  } catch (error) {
    Sentry.captureException(error)
    console.error('删除商品失败:', error)
  }
}

// 清空购物车
const handleClear = () => {
  try {
    cart.clearCart()
  } catch (error) {
    Sentry.captureException(error)
    console.error('清空购物车失败:', error)
  }
}

// 处理结算
const handleCheckout = () => {
  // TODO: 实现结算逻辑
  console.log('进行结算...')
}

// 监听购物车变化
watch(
  () => cart.items,
  () => {
    initializeQuantities()
  },
  { deep: true }
)

// 初始化
onMounted(() => {
  initializeQuantities()
})
</script>

<style>
.cart-container {
  max-width: 1200px;
  margin: 24px auto;
  border-radius: 28px;
  overflow: hidden;
}

.cart-items-list {
  max-height: 60vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--md-sys-color-primary) transparent;
}

.cart-items-list::-webkit-scrollbar {
  width: 6px;
}

.cart-items-list::-webkit-scrollbar-track {
  background: transparent;
}

.cart-items-list::-webkit-scrollbar-thumb {
  background-color: rgb(var(--md-sys-color-primary));
  border-radius: 3px;
}

.cart-item {
  transition: transform 0.2s ease-out, box-shadow 0.2s ease-out;
  cursor: pointer;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.cart-item-wrapper {
  position: relative;
}

/* Material Components 自定义样式 */
md-filled-text-field {
  --md-filled-text-field-container-shape: 8px;
}

md-filled-button,
md-filled-tonal-button {
  --md-filled-button-container-shape: 16px;
  --md-filled-tonal-button-container-shape: 16px;
}

/* 动画效果 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-item {
  animation: slideIn 0.3s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .cart-item {
    animation: none;
  }
}
</style>
