<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3 mb-0">Course Instances Management</h1>
      <div class="d-flex gap-2">
        <button class="btn btn-primary" @click="refreshInstances" :disabled="refreshing">
          <span v-if="refreshing" class="spinner-border spinner-border-sm me-2"></span>
          <RefreshCw :size="18" class="me-2" />
          {{ refreshing ? 'Refreshing...' : 'Refresh Instances' }}
        </button>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="text-muted mb-2">Total Instances</h6>
            <h3 class="mb-0">{{ totalInstances }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="text-muted mb-2">Available</h6>
            <h3 class="mb-0 text-success">{{ availableInstances }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="text-muted mb-2">Full</h6>
            <h3 class="mb-0 text-danger">{{ fullInstances }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h6 class="text-muted mb-2">Total Bookings</h6>
            <h3 class="mb-0 text-info">{{ totalBookings }}</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white border-bottom">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h5 class="mb-0">Upcoming Course Instances</h5>
          </div>
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text">
                <Search :size="18" />
              </span>
              <input
                type="text"
                class="form-control"
                placeholder="Search by course name or instructor..."
                v-model="searchQuery"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else-if="filteredInstances.length === 0" class="text-center py-5 text-muted">
          <Calendar :size="48" class="mb-3" />
          <p class="mb-0">No course instances found</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Course</th>
                <th>Instructor</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="instance in filteredInstances" :key="instance.id">
                <td>
                  <div class="fw-bold">{{ instance.courseName }}</div>
                  <small class="text-muted">{{ instance.category }}</small>
                </td>
                <td>{{ instance.instructor }}</td>
                <td>
                  <div>{{ formatDate(instance.startTime) }}</div>
                  <small class="text-muted">
                    {{ formatTime(instance.startTime) }} - {{ formatTime(instance.endTime) }}
                  </small>
                </td>
                <td>{{ instance.duration }} min</td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <div class="progress" style="width: 100px; height: 8px;">
                      <div
                        class="progress-bar"
                        :class="getProgressBarClass(instance)"
                        :style="{ width: getBookingPercentage(instance) + '%' }"
                      ></div>
                    </div>
                    <small>
                      <a
                        href="#"
                        @click.prevent="viewBookings(instance)"
                        class="text-decoration-none"
                      >
                        {{ instance.currentBookings }} / {{ instance.maxParticipants }}
                      </a>
                    </small>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(instance.status)">
                    {{ instance.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group btn-group-sm">
                    <button
                      class="btn btn-outline-danger"
                      @click="cancelInstance(instance)"
                      :disabled="instance.status === 'cancelled'"
                      title="Cancel Instance"
                    >
                      <X :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mt-4">
      <div class="card-header bg-white border-bottom">
        <h5 class="mb-0">Recent Task Logs</h5>
      </div>
      <div class="card-body">
        <div v-if="taskLogs.length === 0" class="text-center py-3 text-muted">
          No task logs available
        </div>
        <div v-else class="list-group list-group-flush">
          <div
            v-for="(log, index) in taskLogs"
            :key="index"
            class="list-group-item"
          >
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="d-flex align-items-center gap-2 mb-1">
                  <span
                    class="badge"
                    :class="log.status === 'success' ? 'bg-success' : 'bg-danger'"
                  >
                    {{ log.status }}
                  </span>
                  <strong>{{ log.taskName }}</strong>
                </div>
                <div v-if="log.message" class="text-muted small">{{ log.message }}</div>
                <div v-if="log.error" class="text-danger small">Error: {{ log.error }}</div>
              </div>
              <small class="text-muted">{{ formatLogTime(log.timestamp) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bookings Modal -->
  <div class="modal fade" id="bookingsModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Course Bookings</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedInstance">
            <h6 class="fw-bold">{{ selectedInstance.courseName }}</h6>
            <p class="text-muted mb-3">
              {{ formatDate(selectedInstance.startTime) }} at {{ formatTime(selectedInstance.startTime) }}
            </p>

            <div v-if="loadingBookings" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else-if="instanceBookings.length === 0" class="text-center py-4 text-muted">
              No bookings yet for this session
            </div>

            <div v-else class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Booked At</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="booking in instanceBookings" :key="booking.id">
                    <td>{{ booking.userName }}</td>
                    <td>{{ booking.userEmail }}</td>
                    <td>{{ formatBookingTime(booking.createdAt) }}</td>
                    <td>
                      <span class="badge" :class="booking.status === 'confirmed' ? 'bg-success' : 'bg-secondary'">
                        {{ booking.status }}
                      </span>
                    </td>
                    <td>
                      <small>{{ booking.notes || '-' }}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RefreshCw, Search, Calendar, X } from 'lucide-vue-next'
import { courseInstancesService, type CourseInstance } from '@/services/courseInstancesService'
import { courseBookingsService, type CourseBooking } from '@/services/coursesService'
import { scheduledTasksService } from '@/services/scheduledTasksService'
import { Timestamp } from 'firebase/firestore'

const instances = ref<CourseInstance[]>([])
const loading = ref(false)
const refreshing = ref(false)
const searchQuery = ref('')
const taskLogs = ref(scheduledTasksService.getRecentLogs())
const selectedInstance = ref<CourseInstance | null>(null)
const instanceBookings = ref<CourseBooking[]>([])
const loadingBookings = ref(false)

const totalInstances = computed(() => instances.value.length)
const availableInstances = computed(() =>
  instances.value.filter(i => i.status === 'active' && i.currentBookings < i.maxParticipants).length
)
const fullInstances = computed(() =>
  instances.value.filter(i => i.status === 'full' || i.currentBookings >= i.maxParticipants).length
)
const totalBookings = computed(() =>
  instances.value.reduce((sum, i) => sum + i.currentBookings, 0)
)

const filteredInstances = computed(() => {
  if (!searchQuery.value.trim()) return instances.value

  const query = searchQuery.value.toLowerCase()
  return instances.value.filter(
    i =>
      i.courseName.toLowerCase().includes(query) ||
      i.instructor.toLowerCase().includes(query) ||
      i.category.toLowerCase().includes(query)
  )
})

const loadInstances = async () => {
  loading.value = true
  try {
    const result = await courseInstancesService.getUpcomingInstances(14)
    if (result.success) {
      instances.value = result.data || []
    }
  } catch (error) {
    console.error('Error loading instances:', error)
  } finally {
    loading.value = false
  }
}

const refreshInstances = async () => {
  refreshing.value = true
  try {
    const result = await scheduledTasksService.runWeeklyRefresh()
    if (result.success) {
      alert(`Refresh completed: ${result.message}`)
      await loadInstances()
      taskLogs.value = scheduledTasksService.getRecentLogs()
    } else {
      alert(`Refresh failed: ${result.error}`)
    }
  } catch (error) {
    console.error('Error refreshing instances:', error)
    alert('Error refreshing instances')
  } finally {
    refreshing.value = false
  }
}

const viewBookings = async (instance: CourseInstance) => {
  selectedInstance.value = instance
  loadingBookings.value = true
  instanceBookings.value = []

  const modal = new (window as any).bootstrap.Modal(document.getElementById('bookingsModal'))
  modal.show()

  try {
    const result = await courseBookingsService.getAllBookings()
    if (result.success) {
      instanceBookings.value = (result.data || []).filter(
        booking => booking.courseInstanceId === instance.id && booking.status === 'confirmed'
      )
    }
  } catch (error) {
    console.error('Error loading bookings:', error)
  } finally {
    loadingBookings.value = false
  }
}

const cancelInstance = async (instance: CourseInstance) => {
  if (!instance.id) return

  const confirmed = confirm(
    `Are you sure you want to cancel this instance?\n\n` +
    `Course: ${instance.courseName}\n` +
    `Date: ${formatDate(instance.startTime)}\n` +
    `Time: ${formatTime(instance.startTime)} - ${formatTime(instance.endTime)}\n\n` +
    `${instance.currentBookings} user(s) have booked this session.`
  )

  if (!confirmed) return

  try {
    const result = await courseInstancesService.update(instance.id, {
      status: 'cancelled',
      isActive: false
    })

    if (result.success) {
      alert('Course instance cancelled successfully')
      await loadInstances()
    } else {
      alert('Failed to cancel course instance')
    }
  } catch (error) {
    console.error('Error cancelling instance:', error)
    alert('Error cancelling course instance')
  }
}

const formatDate = (dateTime: any) => {
  const date = dateTime instanceof Timestamp ? dateTime.toDate() : new Date(dateTime)
  return date.toLocaleDateString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (dateTime: any) => {
  const date = dateTime instanceof Timestamp ? dateTime.toDate() : new Date(dateTime)
  return date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
}

const formatLogTime = (timestamp: Date) => {
  return timestamp.toLocaleString('en-AU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatBookingTime = (dateTime: any) => {
  const date = dateTime instanceof Timestamp ? dateTime.toDate() : new Date(dateTime)
  return date.toLocaleString('en-AU', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getBookingPercentage = (instance: CourseInstance) => {
  return (instance.currentBookings / instance.maxParticipants) * 100
}

const getProgressBarClass = (instance: CourseInstance) => {
  const percentage = getBookingPercentage(instance)
  if (percentage >= 100) return 'bg-danger'
  if (percentage >= 75) return 'bg-warning'
  return 'bg-success'
}

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    active: 'bg-success',
    full: 'bg-warning',
    cancelled: 'bg-danger',
    completed: 'bg-secondary'
  }
  return classes[status] || 'bg-secondary'
}

onMounted(() => {
  loadInstances()
})
</script>

<style scoped>
.progress {
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #6c757d;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  vertical-align: middle;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
}
</style>
