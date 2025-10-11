import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  filterable?: boolean
  filterType?: 'text' | 'date' | 'select'
  filterOptions?: Array<{ label: string; value: any }>
}

export interface TableFilters {
  [key: string]: any
}

export interface UseDataTableOptions<T> {
  data: Ref<T[]>
  columns: TableColumn[]
  defaultSortField?: string
  defaultSortOrder?: 'asc' | 'desc'
  rowsPerPage?: number
}

export function useDataTable<T extends Record<string, any>>(options: UseDataTableOptions<T>) {
  const { data, columns, defaultSortField, defaultSortOrder = 'asc', rowsPerPage = 10 } = options

  const globalFilter = ref('')
  const columnFilters = ref<TableFilters>({})
  const sortField = ref(defaultSortField || columns[0]?.field || '')
  const sortOrder = ref<'asc' | 'desc'>(defaultSortOrder)
  const currentPage = ref(1)
  const rows = ref(rowsPerPage)

  const filteredData = computed(() => {
    let result = [...data.value]

    if (globalFilter.value) {
      const searchTerm = globalFilter.value.toLowerCase()
      result = result.filter(item =>
        columns.some(col => {
          const value = item[col.field]
          return value?.toString().toLowerCase().includes(searchTerm)
        })
      )
    }

    Object.entries(columnFilters.value).forEach(([field, filterValue]) => {
      if (filterValue !== null && filterValue !== undefined && filterValue !== '') {
        result = result.filter(item => {
          const itemValue = item[field]
          if (typeof filterValue === 'string') {
            return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase())
          }
          return itemValue === filterValue
        })
      }
    })

    return result
  })

  const sortedData = computed(() => {
    if (!sortField.value) return filteredData.value

    return [...filteredData.value].sort((a, b) => {
      const aVal = a[sortField.value]
      const bVal = b[sortField.value]

      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime()
      } else {
        comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }

      return sortOrder.value === 'asc' ? comparison : -comparison
    })
  })

  const totalRecords = computed(() => filteredData.value.length)
  const totalPages = computed(() => Math.ceil(totalRecords.value / rows.value))

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rows.value
    const end = start + rows.value
    return sortedData.value.slice(start, end)
  })

  const onSort = (field: string) => {
    if (sortField.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortField.value = field
      sortOrder.value = 'asc'
    }
  }

  const onFilter = (field: string, value: any) => {
    columnFilters.value[field] = value
    currentPage.value = 1
  }

  const onGlobalFilter = (value: string) => {
    globalFilter.value = value
    currentPage.value = 1
  }

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const onRowsPerPageChange = (newRows: number) => {
    rows.value = newRows
    currentPage.value = 1
  }

  const clearFilters = () => {
    globalFilter.value = ''
    columnFilters.value = {}
    currentPage.value = 1
  }

  watch(data, () => {
    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = totalPages.value
    }
  })

  return {
    globalFilter,
    columnFilters,
    sortField,
    sortOrder,
    currentPage,
    rows,
    filteredData,
    sortedData,
    paginatedData,
    totalRecords,
    totalPages,
    onSort,
    onFilter,
    onGlobalFilter,
    onPageChange,
    onRowsPerPageChange,
    clearFilters
  }
}
