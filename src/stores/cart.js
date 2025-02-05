// stores/cart.js
import { defineStore } from 'pinia';
import { encrypt, decrypt } from '../utils/crypto';
import * as Sentry from "@sentry/vue";
import debounce from 'lodash/debounce';

/**
 * 购物车状态管理
 * 使用 Pinia 进行全局状态管理
 * [CONCEPT] 使用加密持久化确保数据安全
 * [PATTERN] 单一职责原则：Store 只负责数据管理
 * [PERF] 使用防抖优化计算属性
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),
  
  getters: {
    /**
     * 计算购物车总价
     * [PERF] 使用防抖优化，避免频繁计算
     */
    total: debounce(function() {
      try {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      } catch (error) {
        Sentry.captureException(error);
        return 0;
      }
    }, 300),

    /**
     * 获取购物车商品总数
     */
    itemCount() {
      return this.items.reduce((count, item) => count + item.quantity, 0);
    }
  },

  actions: {
    /**
     * 添加商品到购物车
     * @param {Object} product 商品对象，包含 id, name, price, [quantity]
     * 
     * 错误写法示例：直接push相同商品导致重复
     * this.items.push(product);
     */
    addItem(product) {
      try {
        const index = this.items.findIndex(item => item.id === product.id);
        if (index !== -1) {
          this.items[index].quantity += product.quantity ? product.quantity : 1;
        } else {
          this.items.push({ ...product, quantity: product.quantity || 1 });
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('添加商品失败:', error);
      }
    },

    /**
     * 移除购物车中的商品
     * @param {number|string} id 商品的唯一标识
     */
    removeItem(id) {
      try {
        this.items = this.items.filter(item => item.id !== id);
      } catch (error) {
        Sentry.captureException(error);
        console.error('移除商品失败:', error);
      }
    },

    /**
     * 更新购物车中商品的数量
     * @param {number|string} id 商品的唯一标识
     * @param {number} quantity 新的商品数量
     */
    updateItem(id, quantity) {
      try {
        const product = this.items.find(item => item.id === id);
        if (product) {
          if (quantity > 0) {
            product.quantity = quantity;
          } else {
            this.removeItem(id);
          }
        }
      } catch (error) {
        Sentry.captureException(error);
        console.error('更新商品数量失败:', error);
      }
    },

    /**
     * 清空购物车
     */
    clearCart() {
      try {
        this.items = [];
      } catch (error) {
        Sentry.captureException(error);
        console.error('清空购物车失败:', error);
      }
    }
  },

  persist: {
    // [CONCEPT] 使用加密确保本地存储安全
    serializer: {
      serialize: (state) => {
        try {
          return encrypt(JSON.stringify(state));
        } catch (error) {
          Sentry.captureException(error);
          // 加密失败时使用普通序列化
          return JSON.stringify(state);
        }
      },
      deserialize: (state) => {
        try {
          return JSON.parse(decrypt(state));
        } catch (error) {
          Sentry.captureException(error);
          // 解密失败时尝试普通反序列化
          try {
            return JSON.parse(state);
          } catch {
            // 如果都失败则返回空状态
            return { items: [] };
          }
        }
      }
    }
  }
});
