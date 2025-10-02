<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">Appointments Management</h1>
        <p class="text-muted">View and manage all appointment bookings</p>
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

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-warning bg-opacity-10 p-2 rounded me-3">
                <Clock class="text-warning" :size="24" />
              </div>
              <div>
                <h4 class="mb-0">{{ stats.pending }}</h4>
                <small class="text-muted">Pending</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-success bg-opacity-10 p-2 rounded me-3">
                <CheckCircle class="text-success" :size="24" />
              </div>
              <div>
                <h4 class="mb-0">{{ stats.confirmed }}</h4>
                <small class="text-muted">Confirmed</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-danger bg-opacity-10 p-2 rounded me-3">
                <XCircle class="text-danger" :size="24" />
              </div>
              <div>
                <h4 class="mb-0">{{ stats.cancelled }}</h4>
                <small class="text-muted">Cancelled</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-secondary bg-opacity-10 p-2 rounded me-3">
                <Calendar class="text-secondary" :size="24" />
              </div>
              <div>
                <h4 class="mb-0">{{ stats.completed }}</h4>
                <small class="text-muted">Completed</small>
              </div>
            </div>
          </div>
        </div>
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
      search-placeholder="Search appointments by service type, date, or status..."
      empty-message="No appointments found"
      :show-column-filters="true"
      @sort="tableState.onSort"
      @filter="tableState.onFilter"
      @global-filter="tableState.onGlobalFilter"
      @page-change="tableState.onPageChange"
      @rows-per-page-change="tableState.onRowsPerPageChange"
    >
      <template #cell-serviceType="{ item }">
        <div>
          <div class="fw-semibold">{{ item.serviceType }}</div>
          <small class="text-muted">{{ item.preferredDate }} at {{ item.preferredTime }}</small>
        </div>
      </template>

      <template #cell-urgency="{ item }">
        <span class="badge text-uppercase" :class="getUrgencyBadgeClass(item.urgency)">
          {{ item.urgency }}
        </span>
      </template>

      <template #cell-status="{ item }">
        <select
          class="form-select form-select-sm"
          :value="item.status"
          @change="updateStatus(item.id, ($event.target as HTMLSelectElement).value as any)"
          :class="`status-${item.status}`"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </template>

      <template #cell-createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #actions="{ item }">
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-primary"
            @click="viewDetails(item)"
            title="View Details"
          >
            <Eye :size="14" />
          </button>
          <button
            v-if="item.status === 'pending'"
            class="btn btn-outline-success"
            @click="confirmAppointment(item)"
            title="Confirm"
          >
            <Check :size="14" />
          </button>
        </div>
      </template>
    </BaseDataTable>

    <div class="modal fade" id="appointmentDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Appointment Details</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedAppointment">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Service Type</label>
                <p class="form-control-plaintext">{{ selectedAppointment.serviceType }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Status</label>
                <p class="form-control-plaintext">
                  <span class="badge" :class="getStatusBadgeClass(selectedAppointment.status)">
                    {{ selectedAppointment.status }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Preferred Date</label>
                <p class="form-control-plaintext">{{ selectedAppointment.preferredDate }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Preferred Time</label>
                <p class="form-control-plaintext">{{ selectedAppointment.preferredTime }}</p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Urgency</label>
                <p class="form-control-plaintext">
                  <span class="badge" :class="getUrgencyBadgeClass(selectedAppointment.urgency)">
                    {{ selectedAppointment.urgency }}
                  </span>
                </p>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Created</label>
                <p class="form-control-plaintext">{{ formatDate(selectedAppointment.createdAt) }}</p>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold">Reason</label>
                <p class="form-control-plaintext">{{ selectedAppointment.reason }}</p>
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
import { RefreshCw, Download, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle, Clock, Calendar, Eye, Check } from 'lucide-vue-next'
import BaseDataTable from '@/components/tables/BaseDataTable.vue'
import { useDataTable } from '@/composables/useDataTable'
import {
  appointmentsTableService,
  type AppointmentTableData
} from '@/services/tables/appointmentsTableService'

const appointments = ref<AppointmentTableData[]>([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const selectedAppointment = ref<AppointmentTableData | null>(null)

const stats = computed(() => ({
  pending: appointments.value.filter(a => a.status === 'pending').length,
  confirmed: appointments.value.filter(a => a.status === 'confirmed').length,
  cancelled: appointments.value.filter(a => a.status === 'cancelled').length,
  completed: appointments.value.filter(a => a.status === 'completed').length
}))

const columns = [
  { field: 'serviceType', header: 'Service', sortable: true, filterable: true },
  { field: 'urgency', header: 'Urgency', sortable: true, filterable: true },
  { field: 'status', header: 'Status', sortable: true, filterable: true },
  { field: 'createdAt', header: 'Booked On', sortable: true, filterable: false }
]

const tableState = useDataTable({
  data: appointments,
  columns,
  defaultSortField: 'createdAt',
  defaultSortOrder: 'desc',
  rowsPerPage: 10
})

const loadAppointments = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await appointmentsTableService.getAllAppointments()

    if (result.success && result.data) {
      appointments.value = result.data
    } else {
      error.value = result.error || 'Failed to load appointments'
    }
  } catch (err) {
    error.value = 'An error occurred while loading appointments'
    console.error('Error loading appointments:', err)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadAppointments()
}

const updateStatus = async (
  appointmentId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) => {
  try {
    const result = await appointmentsTableService.updateAppointmentStatus(appointmentId, status)

    if (result.success) {
      const appointment = appointments.value.find(a => a.id === appointmentId)
      if (appointment) {
        appointment.status = status
      }
      successMessage.value = 'Appointment status updated successfully'
      setTimeout(() => (successMessage.value = ''), 3000)
    } else {
      error.value = result.error || 'Failed to update appointment status'
    }
  } catch (err) {
    error.value = 'An error occurred while updating appointment status'
    console.error('Error updating status:', err)
  }
}

const confirmAppointment = async (appointment: AppointmentTableData) => {
  await updateStatus(appointment.id, 'confirmed')
}

const viewDetails = (appointment: AppointmentTableData) => {
  selectedAppointment.value = appointment
  const modal = new (window as any).bootstrap.Modal(document.getElementById('appointmentDetailsModal'))
  modal.show()
}

const exportData = () => {
  const csvContent = [
    ['Service Type', 'Date', 'Time', 'Urgency', 'Status', 'Reason', 'Booked On'],
    ...tableState.filteredData.value.map(appt => [
      appt.serviceType,
      appt.preferredDate,
      appt.preferredTime,
      appt.urgency,
      appt.status,
      appt.reason.replace(/,/g, ';'),
      formatDate(appt.createdAt)
    ])
  ]
    .map(row => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)

  successMessage.value = 'Appointments data exported successfully'
  setTimeout(() => (successMessage.value = ''), 3000)
}

const getStatusBadgeClass = (status: string) => {
  return appointmentsTableService.getStatusBadgeClass(status)
}

const getUrgencyBadgeClass = (urgency: string) => {
  return appointmentsTableService.getUrgencyBadgeClass(urgency)
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  loadAppointments()
})
</script>

<style scoped>
.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.status-pending {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.status-confirmed {
  border-color: #28a745;
  background-color: #d4edda;
}

.status-cancelled {
  border-color: #dc3545;
  background-color: #f8d7da;
}

.status-completed {
  border-color: #6c757d;
  background-color: #e2e3e5;
}

.form-select-sm {
  min-width: 120px;
}
</style>
