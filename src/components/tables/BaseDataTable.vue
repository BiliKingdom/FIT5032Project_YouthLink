<template>
  <div class="data-table-container">
    <div class="table-header mb-3">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="input-group">
            <span class="input-group-text">
              <Search :size="16" />
            </span>
            <input
              type="text"
              class="form-control"
              :placeholder="searchPlaceholder"
              :value="modelValue.globalFilter"
              @input="onGlobalFilterChange"
            />
          </div>
        </div>
        <div class="col-md-6 text-end">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th
              v-for="column in columns"
              :key="column.field"
              :class="{ 'sortable': column.sortable !== false }"
              @click="column.sortable !== false && onSort(column.field)"
            >
              <div class="d-flex align-items-center justify-content-between">
                <span>{{ column.header }}</span>
                <span v-if="column.sortable !== false" class="sort-icon">
                  <ChevronUp
                    v-if="modelValue.sortField === column.field && modelValue.sortOrder === 'asc'"
                    :size="14"
                    class="text-primary"
                  />
                  <ChevronDown
                    v-else-if="modelValue.sortField === column.field && modelValue.sortOrder === 'desc'"
                    :size="14"
                    class="text-primary"
                  />
                  <ChevronsUpDown v-else :size="14" class="text-muted" />
                </span>
              </div>
            </th>
            <th v-if="$slots.actions" class="text-center">Actions</th>
          </tr>
          <tr v-if="showColumnFilters">
            <th v-for="column in columns" :key="`filter-${column.field}`">
              <input
                v-if="column.filterable !== false"
                type="text"
                class="form-control form-control-sm"
                :placeholder="`Filter ${column.header}`"
                :value="modelValue.columnFilters[column.field] || ''"
                @input="onColumnFilter(column.field, ($event.target as HTMLInputElement).value)"
              />
            </th>
            <th v-if="$slots.actions"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="data.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-4 text-muted">
              <slot name="empty">
                <div>
                  <Database :size="32" class="mb-2 opacity-50" />
                  <p class="mb-0">{{ emptyMessage }}</p>
                </div>
              </slot>
            </td>
          </tr>
          <tr v-else v-for="(item, index) in data" :key="getRowKey(item, index)">
            <template v-if="item">
              <td v-for="column in columns" :key="`${getRowKey(item, index)}-${column.field}`">
                <slot :name="`cell-${column.field}`" :item="item" :field="column.field">
                  {{ formatCellValue(item[column.field], column) }}
                </slot>
              </td>
              <td v-if="$slots.actions" class="text-center">
                <slot name="actions" :item="item"></slot>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer mt-3">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <div class="d-flex align-items-center gap-2">
            <span class="text-muted small">Rows per page:</span>
            <select
              class="form-select form-select-sm"
              style="width: auto;"
              :value="modelValue.rows"
              @change="onRowsPerPageChange(parseInt(($event.target as HTMLSelectElement).value))"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            <span class="text-muted small">
              Showing {{ startRecord }} to {{ endRecord }} of {{ totalRecords }} records
            </span>
          </div>
        </div>
        <div class="col-md-6">
          <nav>
            <ul class="pagination pagination-sm justify-content-end mb-0">
              <li class="page-item" :class="{ disabled: modelValue.currentPage === 1 }">
                <button
                  class="page-link"
                  @click="onPageChange(modelValue.currentPage - 1)"
                  :disabled="modelValue.currentPage === 1"
                >
                  Previous
                </button>
              </li>
              <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === modelValue.currentPage }"
              >
                <button class="page-link" @click="onPageChange(page)">
                  {{ page }}
                </button>
              </li>
              <li class="page-item" :class="{ disabled: modelValue.currentPage === totalPages }">
                <button
                  class="page-link"
                  @click="onPageChange(modelValue.currentPage + 1)"
                  :disabled="modelValue.currentPage === totalPages"
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue'
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Database } from 'lucide-vue-next'
import type { TableColumn } from '@/composables/useDataTable'

interface Props {
  columns: TableColumn[]
  data: T[]
  modelValue: {
    globalFilter: string
    columnFilters: Record<string, any>
    sortField: string
    sortOrder: 'asc' | 'desc'
    currentPage: number
    rows: number
  }
  totalRecords: number
  loading?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  showColumnFilters?: boolean
  rowKey?: string | ((item: T) => string | number)
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void
  (e: 'sort', field: string): void
  (e: 'filter', field: string, value: any): void
  (e: 'globalFilter', value: string): void
  (e: 'pageChange', page: number): void
  (e: 'rowsPerPageChange', rows: number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  searchPlaceholder: 'Search...',
  emptyMessage: 'No records found',
  showColumnFilters: false,
  rowKey: 'id'
})

const emit = defineEmits<Emits>()

const totalPages = computed(() => Math.ceil(props.totalRecords / props.modelValue.rows))

const startRecord = computed(() => {
  if (props.totalRecords === 0) return 0
  return (props.modelValue.currentPage - 1) * props.modelValue.rows + 1
})

const endRecord = computed(() => {
  const end = props.modelValue.currentPage * props.modelValue.rows
  return Math.min(end, props.totalRecords)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.modelValue.currentPage
  const delta = 2
  const pages: number[] = []

  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(total - 1, current + delta)

  pages.push(1)

  if (rangeStart > 2) {
    pages.push(-1)
  }

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  if (rangeEnd < total - 1) {
    pages.push(-1)
  }

  if (total > 1) {
    pages.push(total)
  }

  return pages
})

const onSort = (field: string) => {
  emit('sort', field)
}

const onColumnFilter = (field: string, value: any) => {
  emit('filter', field, value)
}

const onGlobalFilterChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('globalFilter', value)
}

const onPageChange = (page: number) => {
  emit('pageChange', page)
}

const onRowsPerPageChange = (rows: number) => {
  emit('rowsPerPageChange', rows)
}

const getRowKey = (item: T, index: number): string | number => {
  if (!item) return index

  if (typeof props.rowKey === 'function') {
    return props.rowKey(item)
  }
  return item[props.rowKey] ?? index
}

const formatCellValue = (value: any, column: TableColumn): string => {
  if (value === null || value === undefined) return '-'

  if (value instanceof Date) {
    return value.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}
</script>

<style scoped>
.data-table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.table thead th {
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  padding: 0.75rem;
  white-space: nowrap;
}

.table thead th.sortable {
  cursor: pointer;
  user-select: none;
}

.table thead th.sortable:hover {
  background-color: #e9ecef;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  margin-left: 0.5rem;
}

.table tbody td {
  padding: 0.75rem;
  vertical-align: middle;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.pagination .page-link {
  color: #0066CC;
  border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
  background-color: #0066CC;
  border-color: #0066CC;
}

.pagination .page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
}
</style>
