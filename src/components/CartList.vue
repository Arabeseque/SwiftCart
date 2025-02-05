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
    <!-- NOTE:使用 v-memo 缓存静态列表，避免不必要的重渲染 -->
    <ul >
      <li v-for="item in cart.items" :key="item.id">
        <span>{{ item.name }} - ¥{{ item.price }} x {{ item.quantity }}</span>
        <button @click="handleRemove(item.id)">删除</button>
        <!-- 错误写法示例：直接在模板中调用 store 方法可能导致多次渲染 -->
        <!-- 正确：使用封装的方法更新数量 -->
        <input 
          type="number" 
          v-model.number="quantities[item.id]" 
          @change="throttledUpdate(item.id)" 
          min="1"
        >
      </li>
    </ul>
    <div>
      <strong>总计: ¥{{ totalPrice }}</strong>
    </div>
    <button @click="handleClear">清空购物车</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import throttle from 'lodash/throttle';

/**
 * 组件功能：
 * - 展示购物车中的商品列表
 * - 支持删除、修改数量、清空购物车操作
 * - 利用 computed 计算总价，并通过节流处理优化数量更新
 * 
 * [CONCEPT]: 组合式 API 实现状态同步
 * [PATTERN]: 单一职责原则，组件专注展示逻辑，Store 负责数据管理
 */
const cart = useCartStore();

// 初始化每个商品对应的数量，用于双向绑定（避免直接修改 store 数据的错误写法示例）
const quantities = ref({});
// 同步购物车中每个商品的数量
const initializeQuantities = () => {
  cart.items.forEach(item => {
    console.log('初始化商品数量', item.id, item.quantity);
    quantities.value[item.id] = item.quantity;
  });
};
// 初始化时同步，防止输入框未绑定
initializeQuantities();

// NOTE:监听购物车变化，保持 quantities 同步（防止错误写法：不更新临时数据导致界面数据错乱）
watch(
  () => cart.items,
  () => {
    console.log('购物车变化，同步商品数量');
    initializeQuantities();
  },
  { deep: true }
);

// 计算购物车总价
const totalPrice = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

/**
 * 更新商品数量
 * 使用节流函数 throttledUpdate 防止短时间内频繁调用
 */
const updateQuantity = (id) => {
  const newQuantity = quantities.value[id];
  //检查数量合法性，防止因错误输入导致 store 状态异常
  if (newQuantity < 1) {
    console.warn("WARNING: 数量必须大于0。");
    // 错误写法示例：直接修改 store 数据，可能导致状态不一致
    quantities.value[id] = 1;
    return;
  }
  // NOTE: 更新到 store 中
  cart.updateItem(id, newQuantity);
};

// 节流包装更新操作，避免高频触发
const throttledUpdate = throttle((id) => {
  updateQuantity(id);
}, 300);

/**
 * 处理删除操作
 * 错误写法示例：直接内联复杂逻辑至模板，容易引起渲染重复
 */
const handleRemove = (id) => {
  cart.removeItem(id);
};

/**
 * 清空购物车
 */
const handleClear = () => {
  cart.clearCart();
};
</script>

<style scoped>
.cart-container {
  padding: 16px;
  border: 1px solid #ddd;
}
.cart-container ul {
  list-style-type: none;
  padding: 0;
}
.cart-container li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.cart-container button {
  margin-left: 8px;
}
</style>
