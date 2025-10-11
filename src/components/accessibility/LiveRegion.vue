<template>
  <div class="visually-hidden">
    <div
      v-for="announcement in announcements"
      :key="announcement.id"
      :aria-live="announcement.priority"
      role="status"
    >
      {{ announcement.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScreenReader } from '@/composables/useScreenReader'

const { announcements } = useScreenReader()
</script>

<style scoped>
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
