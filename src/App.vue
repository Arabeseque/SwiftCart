<template>
  <div id="app">
    <h1>电商购物车 Demo</h1>
    <!-- 引入购物车展示组件 -->
    <CartList />
    <!-- 示例：点击按钮添加一件示例商品 -->
    <button @click="addSampleItem">添加示例商品</button>

    <!-- TODO: 测试 Sentry  -->
    <button @click="testSentry">测试 Sentry</button>
  </div>
</template>

<script setup>
import CartList from './components/CartList.vue';
import { useCartStore } from './stores/cart';

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

const testSentry = () => {
  // 触发一个错误，用于测试 Sentry
  myUndefinedFunction();
  throw new Error('测试 Sentry');
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
