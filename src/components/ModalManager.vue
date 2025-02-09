<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <div
      v-if="internalVisible"
      class="modal-backdrop md-state-layer"
      @click="handleBackdropClick"
      role="presentation"
    >
      <!-- 模态框容器 -->
      <div
        class="modal-container md-elevation-3"
        role="dialog"
        :aria-label="title"
        @click.stop
      >
        <!-- 标题栏 -->
        <div class="modal-header bg-primary p-16dp">
          <h2 class="headline-small text-on-primary mb-0">{{ title }}</h2>
          <md-icon-button @click="handleClose">
            <md-icon class="text-on-primary">close</md-icon>
          </md-icon-button>
        </div>

        <!-- 内容区域 -->
        <div class="modal-content p-24dp">
          <slot></slot>
        </div>

        <!-- 按钮区域 -->
        <div class="modal-actions p-16dp flex justify-end gap-8dp">
          <md-filled-tonal-button
            v-if="showCancel"
            @click="handleCancel"
          >
            {{ cancelText }}
          </md-filled-tonal-button>
          
          <md-filled-button
            @click="handleConfirm"
          >
            {{ confirmText }}
          </md-filled-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'


import { defineProps, defineEmits, defineExpose } from 'vue'

// 导入 Material 组件
import '@material/web/icon/icon'
import '@material/web/iconbutton/icon-button'
import '@material/web/button/filled-button'
import '@material/web/button/filled-tonal-button'
import '@material/web/elevation/elevation'

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '提示'
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  closeOnClickBackdrop: {
    type: Boolean,
    default: true
  }
})

// 定义事件
const emit = defineEmits(['update:visible', 'cancel', 'confirm'])


// 内部状态控制
const internalVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal
})

// 处理背景点击
const handleBackdropClick = () => {
  if (props.closeOnClickBackdrop) {
    handleClose()
  }
}

// 处理关闭
const handleClose = () => {
  internalVisible.value = false;
    emit('update:visible', false)
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
  handleClose()
}

// 处理确认
const handleConfirm = () => {
  emit('confirm')
  handleClose()
}
// Expose methods to control modal visibility externally
defineExpose({
  show: () => {
    console.log("ModalManager: show() called");
    internalVisible.value = true;
    emit('update:visible', true)
    console.log(props.visible);
  },
  close: () => {
    console.log("ModalManager: close() called");
    internalVisible.value = false;
    emit('update:visible', false)
  }
})

</script>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(var(--md-sys-color-scrim), 0.32);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  animation: fadeIn 0.2s var(--md-sys-motion-easing-emphasized);
}

.modal-container {
  position: relative;
  z-index: 99999;
  width: 90%;
  max-width: 560px;
  max-height: 90vh;
  border-radius: 28px;
  overflow: hidden;
  animation: slideIn 0.3s var(--md-sys-motion-easing-emphasized);
  background-color: rgb(var(--md-sys-color-surface));
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-content {
  overflow-y: auto;
  max-height: calc(90vh - 160px);
  background-color: rgb(var(--md-sys-color-surface));
  color: rgb(var(--md-sys-color-on-surface));
}

.modal-actions {
  border-top: 1px solid rgb(var(--md-sys-color-outline-variant));
  background-color: rgb(var(--md-sys-color-surface-container-high));
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .modal-container {
    width: 100%;
    max-width: none;
    margin: 16px;
    border-radius: 24px;
  }
}

/* 可访问性增强 */
.modal-container:focus-visible {
  outline: none;
  box-shadow: var(--md-sys-elevation-level4),
              0 0 0 4px rgb(var(--md-sys-color-primary));
}

/* 滚动条样式 */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: rgb(var(--md-sys-color-outline-variant));
  border-radius: 4px;
}

/* 适配深色模式 */
@media (prefers-color-scheme: dark) {
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.48);
  }
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .modal-backdrop,
  .modal-container {
    animation: none;
  }
}
</style>
