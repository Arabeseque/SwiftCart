// stores/cart.js
import { defineStore } from 'pinia';

/**
 * 购物车状态管理
 * 使用 Pinia 进行全局状态管理
 * 持久化存储使用 persist 插件，确保页面刷新后数据不丢失
 * [CONCEPT] 使用 Pinia 简化状态管理流程
 * [PATTERN] 单一职责原则：Store 只负责数据管理，组件负责视图渲染
 */
export const useCartStore = defineStore('cart', {
  state: () => ({
    // items 为购物车中的商品数组，每个商品包含 id, name, price, quantity
    items: []
  }),
  actions: {
    /**
     * 添加商品到购物车
     * @param {Object} product 商品对象，包含 id, name, price, [quantity]
     * 示例: addItem({ id: 1, name: '商品1', price: 100, quantity: 2 })
     *
     * 注意：若商品已存在，则更新数量而不是直接替换
     * 错误写法示例：直接 push 相同商品对象可能导致重复数据
     */
    addItem(product) {
      const index = this.items.findIndex(item => item.id === product.id);
      if (index !== -1) {
        // NOTE: 更新商品数量
        this.items[index].quantity += product.quantity ? product.quantity : 1;
      } else {
        // NOTE: 默认 quantity 为 1，如未传入量则默认初始化为 1
        this.items.push({ ...product, quantity: product.quantity || 1 });
      }
    },

    /**
     * 移除购物车中的商品
     * @param {number|string} id 商品的唯一标识
     * 示例: removeItem(1)
     */
    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id);
    },

    /**
     * 更新购物车中商品的数量
     * @param {number|string} id 商品的唯一标识
     * @param {number} quantity 新的商品数量
     * 示例: updateItem(1, 5)
     */
    updateItem(id, quantity) {
      const product = this.items.find(item => item.id === id);
      if (product) {
        // NOTE: 若新的数量小于等于 0，则移除该商品，避免错误操作
        if (quantity > 0) {
          product.quantity = quantity;
        } else {
          this.removeItem(id);
        }
      }
    },

    /**
     * 清空购物车
     * 示例: clearCart()
     */
    clearCart() {
      this.items = [];
    }
  },
  // 使用 persist 插件实现购物车数据持久化存储到 localStorage
  persist: true
});
