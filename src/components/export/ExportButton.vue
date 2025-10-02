<template>
  <div class="export-button-group">
    <div class="btn-group">
      <button
        type="button"
        class="btn btn-primary"
        :disabled="disabled || isExporting"
        @click="handleExport('csv')"
      >
        <div v-if="isExporting" class="spinner-border spinner-border-sm me-2"></div>
        <Download v-else :size="16" class="me-2" />
        {{ label }}
      </button>
      <button
        type="button"
        class="btn btn-primary dropdown-toggle dropdown-toggle-split"
        :disabled="disabled || isExporting"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span class="visually-hidden">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li>
          <a class="dropdown-item" href="#" @click.prevent="handleExport('csv')">
            <FileText :size="14" class="me-2" />
            Export as CSV
          </a>
        </li>
        <li>
          <a class="dropdown-item" href="#" @click.prevent="handleExport('pdf')">
            <FileType :size="14" class="me-2" />
            Export as PDF
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download, FileText, FileType } from 'lucide-vue-next'

interface Props {
  disabled?: boolean
  isExporting?: boolean
  label?: string
}

interface Emits {
  (e: 'export', format: 'csv' | 'pdf'): void
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  isExporting: false,
  label: 'Export'
})

const emit = defineEmits<Emits>()

const handleExport = (format: 'csv' | 'pdf') => {
  emit('export', format)
}
</script>

<style scoped>
.export-button-group {
  display: inline-block;
}

.dropdown-item {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-item:active {
  background-color: #0066cc;
  color: white;
}
</style>
