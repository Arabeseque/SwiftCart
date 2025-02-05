<template>
  <div id="app">
    <h1>电商购物车 Demo</h1>
    
    <div class="container">
      <div class="cart-section">
        <!-- 购物车列表 -->
        <CartList />
        <div class="actions">
          <button @click="addSampleItem" class="btn primary">添加示例商品</button>
          <button @click="testSentry" class="btn">测试 Sentry</button>
        </div>
      </div>
      
      <!-- 数据可视化区域 -->
      <div class="chart-section">
        <CartChart v-if="cart.items.length > 0" />
      </div>
    </div>
  </div>
</template>

<script setup>
import CartList from './components/CartList.vue';
import CartChart from './components/CartChart.vue';
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

.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.cart-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-section {
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.btn.primary {
  background: #4CAF50;
  color: white;
  border: none;
}
</style>
