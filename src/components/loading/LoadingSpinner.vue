<template>
  <div :class="['loading-spinner', sizeClass, { overlay }]" role="status" :aria-label="label">
    <div class="spinner-border" :class="colorClass">
      <span class="visually-hidden">{{ label }}</span>
    </div>
    <p v-if="message" class="loading-message mt-2">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  overlay?: boolean
  message?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'primary',
  overlay: false,
  label: 'Loading...'
})

const sizeClass = computed(() => {
  const sizes = {
    sm: 'spinner-sm',
    md: '',
    lg: 'spinner-lg'
  }
  return sizes[props.size]
})

const colorClass = computed(() => `text-${props.color}`)
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9998;
}

.spinner-sm .spinner-border {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 0.2em;
}

.spinner-lg .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.3em;
}

.loading-message {
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
