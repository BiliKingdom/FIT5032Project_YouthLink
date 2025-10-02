<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">User Management</h1>
        <p class="text-muted">Manage user accounts and permissions</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" @click="refreshData" :disabled="loading">
          <RefreshCw :size="16" class="me-2" :class="{ 'spin': loading }" />
          Refresh
        </button>
        <button class="btn btn-primary" @click="exportData">
          <Download :size="16" class="me-2" />
          Export
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <AlertCircle :size="16" class="me-2" />
      {{ error }}
      <button type="button" class="btn-close" @click="error = ''"></button>
    </div>

    <div v-if="successMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      <CheckCircle :size="16" class="me-2" />
      {{ successMessage }}
      <button type="button" class="btn-close" @click="successMessage = ''"></button>
    </div>

    <BaseDataTable
      :columns="columns"
      :data="tableState.paginatedData.value"
      :model-value="{
        globalFilter: tableState.globalFilter.value,
        columnFilters: tableState.columnFilters.value,
        sortField: tableState.sortField.value,
        sortOrder: tableState.sortOrder.value,
        currentPage: tableState.currentPage.value,
        rows: tableState.rows.value
      }"
      :total-records="tableState.totalRecords.value"
      :loading="loading"
      search-placeholder="Search users by name, email, or role..."
      empty-message="No users found"
      :show-column-filters="true"
      @sort="tableState.onSort"
      @filter="tableState.onFilter"
      @global-filter="tableState.onGlobalFilter"
      @page-change="tableState.onPageChange"
      @rows-per-page-change="tableState.onRowsPerPageChange"
    >
      <template #cell-displayName="{ item }">
        <div class="d-flex align-items-center">
          <div class="avatar-circle me-2">
            {{ getInitials(item.displayName) }}
          </div>
          <div>
            <div class="fw-semibold">{{ item.displayName }}</div>
            <small class="text-muted">{{ item.email }}</small>
          </div>
        </div>
      </template>

      <template #cell-role="{ item }">
        <select
          class="form-select form-select-sm"
          :value="item.role"
          @change="updateRole(item.id, ($event.target as HTMLSelectElement).value as 'user' | 'admin')"
          :disabled="item.id === currentUserId"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </template>

      <template #cell-createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #cell-status="{ item }">
        <span class="badge" :class="item.status === 'active' ? 'bg-success' : 'bg-secondary'">
          {{ item.status }}
        </span>
      </template>

      <template #actions="{ item }">
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-primary"
            @click="viewUserDetails(item)"
            title="View Details"
          >
            <Eye :size="14" />
          </button>
          <button
            class="btn btn-outline-secondary"
            @click="toggleUserStatus(item)"
            :disabled="item.id === currentUserId"
            :title="item.status === 'active' ? 'Deactivate' : 'Activate'"
          >
            <UserX v-if="item.status === 'active'" :size="14" />
            <UserCheck v-else :size="14" />
          </button>
        </div>
      </template>
    </BaseDataTable>

    <div class="modal fade" id="userDetailsModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">User Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Name</label>
                <p class="form-control-plaintext">{{ selectedUser.displayName }}</p>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Email</label>
                <p class="form-control-plaintext">{{ selectedUser.email }}</p>
              </div>
              <div class="col-6">
                <label class="form-label fw-semibold">Role</label>
                <p class="form-control-plaintext text-capitalize">{{ selectedUser.role }}</p>
              </div>
              <div class="col-6">
                <label class="form-label fw-semibold">Status</label>
                <p class="form-control-plaintext">
                  <span class="badge" :class="selectedUser.status === 'active' ? 'bg-success' : 'bg-secondary'">
                    {{ selectedUser.status }}
                  </span>
                </p>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Member Since</label>
                <p class="form-control-plaintext">{{ formatDate(selectedUser.createdAt) }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RefreshCw, Download, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Eye, UserX, UserCheck } from 'lucide-vue-next'
import BaseDataTable from '@/components/tables/BaseDataTable.vue'
import { useDataTable } from '@/composables/useDataTable'
import { usersTableService, type UserTableData } from '@/services/tables/usersTableService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const users = ref<UserTableData[]>([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const selectedUser = ref<UserTableData | null>(null)

const currentUserId = computed(() => authStore.user?.id)

const columns = [
  { field: 'displayName', header: 'User', sortable: true, filterable: true },
  { field: 'role', header: 'Role', sortable: true, filterable: true },
  { field: 'createdAt', header: 'Member Since', sortable: true, filterable: false },
  { field: 'status', header: 'Status', sortable: true, filterable: true }
]

const tableState = useDataTable({
  data: users,
  columns,
  defaultSortField: 'createdAt',
  defaultSortOrder: 'desc',
  rowsPerPage: 10
})

const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await usersTableService.getAllUsers()

    if (result.success && result.data) {
      users.value = result.data
    } else {
      error.value = result.error || 'Failed to load users'
    }
  } catch (err) {
    error.value = 'An error occurred while loading users'
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadUsers()
}

const updateRole = async (userId: string, newRole: 'user' | 'admin') => {
  try {
    const result = await usersTableService.updateUserRole(userId, newRole)

    if (result.success) {
      const user = users.value.find(u => u.id === userId)
      if (user) {
        user.role = newRole
      }
      successMessage.value = 'User role updated successfully'
      setTimeout(() => (successMessage.value = ''), 3000)
    } else {
      error.value = result.error || 'Failed to update user role'
    }
  } catch (err) {
    error.value = 'An error occurred while updating user role'
    console.error('Error updating role:', err)
  }
}

const toggleUserStatus = async (user: UserTableData) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'

  try {
    const result = await usersTableService.updateUserStatus(user.id, newStatus)

    if (result.success) {
      user.status = newStatus
      successMessage.value = `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
      setTimeout(() => (successMessage.value = ''), 3000)
    } else {
      error.value = result.error || 'Failed to update user status'
    }
  } catch (err) {
    error.value = 'An error occurred while updating user status'
    console.error('Error toggling status:', err)
  }
}

const viewUserDetails = (user: UserTableData) => {
  selectedUser.value = user
  const modal = new (window as any).bootstrap.Modal(document.getElementById('userDetailsModal'))
  modal.show()
}

const exportData = () => {
  const csvContent = [
    ['Name', 'Email', 'Role', 'Status', 'Member Since'],
    ...tableState.filteredData.value.map(user => [
      user.displayName,
      user.email,
      user.role,
      user.status,
      formatDate(user.createdAt)
    ])
  ]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `users-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  successMessage.value = 'Users data exported successfully'
  setTimeout(() => (successMessage.value = ''), 3000)
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.form-select-sm {
  min-width: 100px;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
