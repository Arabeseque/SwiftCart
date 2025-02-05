<!--
设计思路文档：
- 本组件负责展示购物车商品列表，支持删除、修改商品数量和清空购物车操作。
- 利用 v-memo 缓存静态列表渲染结果，防止购物车列表在非必要时频繁重渲染（[PERF]）。
- 使用 lodash.throttle 对更新商品数量操作进行节流，避免高频更新触发性能问题（[PERF]）。
  
关键技术选型理由：
- [CONCEPT]: 使用 Pinia 简化状态管理，配合组合式 API 实现业务逻辑分离。
- [PATTERN]: 单一职责原则，组件只负责视图展示，数据逻辑集中在 store 中。
- [PERF]: v-memo 缓存与 throttle 节流优化性能，避免重复渲染和高频更新。
-->

<template>
  <div class="cart-container">
    <h2>购物车</h2>
    <!-- 使用 v-memo 缓存静态列表，避免不必要的重渲染 -->
    <ul>
      <li 
        v-for="item in cart.items" 
        :key="item.id"
        v-memo="[item.id, item.name, item.price, item.quantity]"
      >
        <span>{{ item.name }} - ¥{{ item.price }} x {{ item.quantity }}</span>
        <div class="item-controls">
          <button @click="handleRemove(item.id)" class="remove-btn">
            删除
          </button>
          <!-- 
            错误写法示例：直接在模板中调用 store 方法
            @input="cart.updateItem(item.id, $event.target.value)" 
          -->
          <input 
            type="number" 
            v-model.number="quantities[item.id]" 
            @change="throttledUpdate(item.id)" 
            min="1"
            class="quantity-input"
          >
        </div>
      </li>
    </ul>
    <!-- 使用计算属性缓存总价，避免频繁计算 -->
    <div class="cart-summary">
      <strong>总计: ¥{{ cart.total }}</strong>
      <button @click="handleClear" class="clear-btn">清空购物车</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import throttle from 'lodash/throttle';
import * as Sentry from "@sentry/vue";

/**
 * 组件功能：
 * - 展示购物车中的商品列表
 * - 支持删除、修改数量、清空购物车操作
 * - 使用 v-memo 优化列表渲染性能
 * 
 * [CONCEPT]: 组合式 API 实现状态同步
 * [PATTERN]: 单一职责原则，组件专注展示逻辑
 * [PERF]: 使用 v-memo 和 throttle 优化性能
 */
const cart = useCartStore();

// 初始化每个商品对应的数量，用于双向绑定
const quantities = ref({});

// 同步购物车中每个商品的数量
const initializeQuantities = () => {
  try {
    cart.items.forEach(item => {
      quantities.value[item.id] = item.quantity;
    });
  } catch (error) {
    Sentry.captureException(error);
    console.error('初始化数量失败:', error);
  }
};

// 初始化时同步，防止输入框未绑定
initializeQuantities();

// 监听购物车变化，保持 quantities 同步
watch(
  () => cart.items,
  () => {
    initializeQuantities();
  },
  { deep: true }
);

/**
 * 更新商品数量
 * 使用节流函数 throttledUpdate 防止短时间内频繁调用
 */
const updateQuantity = (id) => {
  try {
    const newQuantity = quantities.value[id];
    if (newQuantity < 1) {
      quantities.value[id] = 1;
      return;
    }
    cart.updateItem(id, newQuantity);
  } catch (error) {
    Sentry.captureException(error);
    console.error('更新数量失败:', error);
  }
};

// 节流包装更新操作，避免高频触发
const throttledUpdate = throttle((id) => {
  updateQuantity(id);
}, 300);

/**
 * 处理删除操作
 */
const handleRemove = (id) => {
  try {
    cart.removeItem(id);
  } catch (error) {
    Sentry.captureException(error);
    console.error('删除商品失败:', error);
  }
};

/**
 * 清空购物车
 */
const handleClear = () => {
  try {
    cart.clearCart();
  } catch (error) {
    Sentry.captureException(error);
    console.error('清空购物车失败:', error);
  }
};
</script>

<style scoped>
.cart-container {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  max-width: 800px;
  margin: 0 auto;
}

.cart-container ul {
  list-style-type: none;
  padding: 0;
}

.cart-container li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  width: 60px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn, .clear-btn {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: #ff4d4f;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover, .clear-btn:hover {
  background-color: #ff7875;
}

.cart-summary {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
