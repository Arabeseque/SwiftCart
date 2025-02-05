<template>
  <!-- [PATTERN] 使用 Teleport 将弹窗渲染到独立容器中，避免嵌套问题 -->
  <teleport to="#modal-container">
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay" @click="closeOnOverlay">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="close">×</button>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref } from 'vue'

/**
 * [CONCEPT] Teleport 弹窗管理
 * - 使用独立的 DOM 节点管理弹窗
 * - 避免父组件样式干扰
 * - 统一管理层级关系
 */

const isVisible = ref(false)
const title = ref('')

// 对外暴露的方法
const show = (modalTitle) => {
  title.value = modalTitle
  isVisible.value = true
}

const close = () => {
  isVisible.value = false
}

// 点击遮罩层关闭弹窗
const closeOnOverlay = (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    close()
  }
}

// [PATTERN] 暴露组件方法供外部调用
defineExpose({
  show,
  close
})
</script>

<style scoped>
/* [PERF] 使用 CSS 变量方便主题定制 */
:root {
  --modal-z-index: 1000;
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-content-bg: #fff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--modal-overlay-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: var(--modal-z-index);
}

.modal-content {
  background: var(--modal-content-bg);
  border-radius: 8px;
  padding: 20px;
  min-width: 300px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  color: #666;
}

.close-btn:hover {
  color: #000;
}

/* [PERF] 使用 transform 优化动画性能 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
