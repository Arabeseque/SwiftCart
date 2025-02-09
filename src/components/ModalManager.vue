<template>
  <Teleport to="body">
    <div
      v-if="internalVisible"
      class="modal-backdrop"
      @click="handleBackdropClick"
      role="presentation"
    >
      <div
        class="modal-container"
        role="dialog"
        :aria-label="title"
        @click.stop
      >
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="close-button" @click="handleClose">
            <span class="close-icon">×</span>
          </button>
        </div>

        <div class="modal-content">
          <slot></slot>
        </div>

        <div class="modal-actions">
          <button
            v-if="showCancel"
            class="button button-tonal"
            @click="handleCancel"
          >
            {{ cancelText }}
          </button>
          
          <button
            class="button button-filled"
            @click="handleConfirm"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

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

const emit = defineEmits(['update:visible', 'cancel', 'confirm'])

const internalVisible = ref(props.visible)
watch(() => props.visible, (newVal) => {
  internalVisible.value = newVal
})

const handleBackdropClick = () => {
  if (props.closeOnClickBackdrop) {
    handleClose()
  }
}

const handleClose = () => {
  internalVisible.value = false
  emit('update:visible', false)
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

defineExpose({
  show: () => {
    internalVisible.value = true
    emit('update:visible', true)
  },
  close: () => {
    internalVisible.value = false
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  position: relative;
  width: 90%;
  max-width: 560px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  animation: modal-slide-in 0.3s cubic-bezier(0.3, 0, 0, 1);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: var(--md-sys-color-primary, #6750A4);
  color: #fff;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.close-icon {
  font-size: 24px;
  line-height: 1;
}

.modal-content {
  padding: 24px;
  max-height: calc(90vh - 200px);
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  background-color: var(--md-sys-color-surface-container, #F3EDF7);
}

.button {
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.button-filled {
  background-color: var(--md-sys-color-primary, #6750A4);
  color: black;
}

.button-filled:hover {
  background-color: var(--md-sys-color-primary, #7C6AAF);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.button-tonal {
  background-color: var(--md-sys-color-secondary-container, #E8DEF8);
  color: var(--md-sys-color-on-secondary-container, #1D192B);
}

.button-tonal:hover {
  background-color: var(--md-sys-color-secondary-container, #DBD1EC);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@keyframes modal-slide-in {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 640px) {
  .modal-container {
    width: calc(100% - 32px);
    margin: 16px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .modal-container {
    animation: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .modal-container {
    background: #1C1B1F;
    color: #E6E0E9;
  }

  .modal-actions {
    border-top-color: rgba(255, 255, 255, 0.12);
  }
}
</style>
