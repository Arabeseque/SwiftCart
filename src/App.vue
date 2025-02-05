<template>
  <div id="app">
    <h1>电商购物车 Demo</h1>
    <!-- 引入购物车展示组件 -->
    <CartList />
    <!-- 示例：点击按钮添加一件示例商品 -->
    <button @click="addSampleItem">添加示例商品</button>
  </div>
</template>

<script setup>
import CartList from './components/CartList.vue';
import { useCartStore } from './stores/cart';

/**
 * 组件功能：
 * - App.vue 作为应用入口，集成购物车组件，并提供添加示例商品的操作。
 * - 通过 Pinia 管理购物车状态，保证随页面刷新数据可持久化存储。
 *
 * 示例用法：
 * <App />
 *
 * [CONCEPT]: 利用组合式 API 实现状态管理与视图展示分离。
 * [PATTERN]: 单一职责原则，组件只负责视图逻辑，Store 负责数据管理。
 */

// 获取购物车 store 实例
const cart = useCartStore();

/**
 * 添加示例商品
 * NOTE: 此示例仅用于触发购物车状态更新，在实际业务中应从商品页面选择商品
 * 错误写法示例：直接在组件中修改 store 数据可能导致状态混乱，建议通过 store 方法封装逻辑
 */
const addSampleItem = () => {
  const sampleItem = {
    id: Date.now(), // 使用当前时间戳模拟唯一 id
    name: '示例商品',
    price: 100,
    quantity: 1
  };
  cart.addItem(sampleItem);
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  padding: 20px;
}
button {
  margin-top: 20px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
