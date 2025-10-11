<template>
  <teleport to="body">
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <transition-group name="toast">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['toast', 'show', `toast-${notification.type}`]"
          role="alert"
          :aria-live="notification.type === 'error' ? 'assertive' : 'polite'"
        >
          <div class="toast-header">
            <component :is="getIcon(notification.type)" :size="16" class="me-2" />
            <strong class="me-auto">{{ getTitle(notification.type) }}</strong>
            <button
              v-if="notification.dismissible"
              type="button"
              class="btn-close"
              :aria-label="'Close ' + notification.type + ' notification'"
              @click="removeNotification(notification.id)"
            ></button>
          </div>
          <div class="toast-body">
            {{ notification.message }}
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { CircleCheck as CheckCircle, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info } from 'lucide-vue-next'
import { useNotifications, type NotificationType } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const getIcon = (type: NotificationType) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  }
  return icons[type]
}

const getTitle = (type: NotificationType): string => {
  const titles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  }
  return titles[type]
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #28a745;
}

.toast-error {
  border-left-color: #dc3545;
}

.toast-warning {
  border-left-color: #ffc107;
}

.toast-info {
  border-left-color: #0066CC;
}

.toast-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.toast-success .toast-header {
  color: #28a745;
}

.toast-error .toast-header {
  color: #dc3545;
}

.toast-warning .toast-header {
  color: #856404;
}

.toast-info .toast-header {
  color: #0066CC;
}

.toast-body {
  padding: 12px 16px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  opacity: 0.5;
  cursor: pointer;
  padding: 0;
  margin-left: auto;
}

.btn-close:hover {
  opacity: 1;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

@media (max-width: 576px) {
  .toast-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
