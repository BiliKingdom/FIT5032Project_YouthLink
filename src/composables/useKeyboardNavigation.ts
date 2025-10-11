import { onMounted, onUnmounted, type Ref } from 'vue'

export interface KeyboardNavigationOptions {
  onEnter?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  onSpace?: () => void
}

export function useKeyboardNavigation(
  elementRef: Ref<HTMLElement | null>,
  options: KeyboardNavigationOptions
) {
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        if (options.onEnter) {
          event.preventDefault()
          options.onEnter()
        }
        break
      case 'Escape':
        if (options.onEscape) {
          event.preventDefault()
          options.onEscape()
        }
        break
      case 'ArrowUp':
        if (options.onArrowUp) {
          event.preventDefault()
          options.onArrowUp()
        }
        break
      case 'ArrowDown':
        if (options.onArrowDown) {
          event.preventDefault()
          options.onArrowDown()
        }
        break
      case 'ArrowLeft':
        if (options.onArrowLeft) {
          event.preventDefault()
          options.onArrowLeft()
        }
        break
      case 'ArrowRight':
        if (options.onArrowRight) {
          event.preventDefault()
          options.onArrowRight()
        }
        break
      case 'Tab':
        if (options.onTab) {
          options.onTab()
        }
        break
      case ' ':
        if (options.onSpace) {
          event.preventDefault()
          options.onSpace()
        }
        break
    }
  }

  onMounted(() => {
    if (elementRef.value) {
      elementRef.value.addEventListener('keydown', handleKeydown)
    }
  })

  onUnmounted(() => {
    if (elementRef.value) {
      elementRef.value.removeEventListener('keydown', handleKeydown)
    }
  })

  return {
    handleKeydown
  }
}
