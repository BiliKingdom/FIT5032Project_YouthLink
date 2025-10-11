import { ref } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: number
  type: NotificationType
  message: string
  duration?: number
  dismissible?: boolean
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export function useNotifications() {
  const addNotification = (
    type: NotificationType,
    message: string,
    duration: number = 5000,
    dismissible: boolean = true
  ) => {
    const id = ++notificationId
    const notification: Notification = {
      id,
      type,
      message,
      duration,
      dismissible
    }

    notifications.value.push(notification)

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }

    return id
  }

  const removeNotification = (id: number) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const success = (message: string, duration?: number) => {
    return addNotification('success', message, duration)
  }

  const error = (message: string, duration?: number) => {
    return addNotification('error', message, duration)
  }

  const warning = (message: string, duration?: number) => {
    return addNotification('warning', message, duration)
  }

  const info = (message: string, duration?: number) => {
    return addNotification('info', message, duration)
  }

  const clear = () => {
    notifications.value = []
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    clear
  }
}
