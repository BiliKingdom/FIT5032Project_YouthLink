import { ref } from 'vue'

export type AnnouncementPriority = 'polite' | 'assertive'

export function useScreenReader() {
  const announcements = ref<Array<{ id: number; message: string; priority: AnnouncementPriority }>>([])
  let announcementId = 0

  const announce = (message: string, priority: AnnouncementPriority = 'polite') => {
    const id = ++announcementId
    announcements.value.push({ id, message, priority })

    setTimeout(() => {
      announcements.value = announcements.value.filter(a => a.id !== id)
    }, 1000)
  }

  const announceNavigation = (pageName: string) => {
    announce(`Navigated to ${pageName}`, 'polite')
  }

  const announceAction = (action: string) => {
    announce(action, 'polite')
  }

  const announceError = (error: string) => {
    announce(`Error: ${error}`, 'assertive')
  }

  const announceSuccess = (message: string) => {
    announce(message, 'polite')
  }

  const announceLoading = (isLoading: boolean, context?: string) => {
    if (isLoading) {
      announce(`Loading${context ? ` ${context}` : ''}`, 'polite')
    } else {
      announce(`Finished loading${context ? ` ${context}` : ''}`, 'polite')
    }
  }

  return {
    announcements,
    announce,
    announceNavigation,
    announceAction,
    announceError,
    announceSuccess,
    announceLoading
  }
}
