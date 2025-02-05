<template>
  <div class="product-list">
    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card" @click="showProductDetail(product)">
        <div class="product-image-wrapper">
          <img :src="product.image" :alt="product.name" class="product-image">
        </div>
        <div class="product-info">
          <h3 class="product-title">{{ product.name }}</h3>
          <p class="product-price">¥{{ product.price.toFixed(2) }}</p>
          <button class="add-to-cart" @click.stop="addToCart(product)">加入购物车</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

/**
 * [CONCEPT] 模拟商品数据
 * 实际项目中应该从API获取
 */
const products = ref([
  {
    id: 1,
    name: '高性能笔记本',
    price: 6999.00,
    image: 'https://picsum.photos/300/300?random=1',
    description: '新一代高性能笔记本，搭载最新处理器'
  },
  {
    id: 2,
    name: '无线蓝牙耳机',
    price: 899.00,
    image: 'https://picsum.photos/300/300?random=2',
    description: '高品质音频体验，超长续航时间'
  },
  {
    id: 3,
    name: '智能手表',
    price: 1299.00,
    image: 'https://picsum.photos/300/300?random=3',
    description: '全天候健康监测，智能运动指导'
  },
  {
    id: 4,
    name: '4K高清摄像机',
    price: 3999.00,
    image: 'https://picsum.photos/300/300?random=4',
    description: '专业级视频拍摄，稳定防抖'
  },
  {
    id: 5,
    name: '游戏手柄',
    price: 299.00,
    image: 'https://picsum.photos/300/300?random=5',
    description: '人体工学设计，支持多平台'
  },
  {
    id: 6,
    name: '智能音箱',
    price: 499.00,
    image: 'https://picsum.photos/300/300?random=6',
    description: 'AI语音助手，环绕立体声'
  }
])

// [PATTERN] 事件处理
const emit = defineEmits(['show-modal'])

const showProductDetail = (product) => {
  emit('show-modal', product)
}

const addToCart = (product) => {
  // TODO: 实现购物车逻辑
  console.log('添加到购物车:', product)
}
</script>

<style scoped>
/* [PERF] 使用 CSS Grid 实现响应式布局 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
}

.product-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image-wrapper {
  position: relative;
  padding-top: 100%; /* 1:1 宽高比 */
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-title {
  font-size: 16px;
  margin: 0 0 10px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff6b6b;
  margin: 0 0 15px;
}

.add-to-cart {
  width: 100%;
  padding: 8px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.add-to-cart:hover {
  background: #45a049;
}

/* [PERF] 响应式优化 */
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 15px;
    padding: 15px;
  }

  .product-title {
    font-size: 14px;
  }

  .product-price {
    font-size: 16px;
  }
}

/* [PERF] 打印样式优化 */
@media print {
  .add-to-cart {
    display: none;
  }
  
  .product-card {
    break-inside: avoid;
    box-shadow: none;
  }
}
</style>
