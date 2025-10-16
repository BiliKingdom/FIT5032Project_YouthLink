<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">Analytics Dashboard</h1>
        <p class="text-muted">Interactive charts and statistics</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" @click="refreshAllData" :disabled="isLoading">
          <RefreshCw :size="16" class="me-2" :class="{ 'spin': isLoading }" />
          Refresh
        </button>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <AlertCircle :size="16" class="me-2" />
      {{ error }}
      <button type="button" class="btn-close" @click="error = ''"></button>
    </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <TrendingUp :size="20" class="me-2" />
              User Registration Trend
            </h5>
            <small class="text-muted">Last 6 months</small>
          </div>
          <div class="card-body">
            <div v-if="chartLoading.userTrend" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <LineChart
              v-else-if="userTrendLabels.length > 0"
              :labels="userTrendLabels"
              :data="userTrendData"
              label="New Users"
              border-color="#0066CC"
              background-color="rgba(0, 102, 204, 0.1)"
              :fill="true"
            />
            <div v-else class="text-center py-5 text-muted">
              <BarChart2 :size="48" class="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <Users :size="20" class="me-2" />
              Users by Role
            </h5>
          </div>
          <div class="card-body">
            <div v-if="chartLoading.usersByRole" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <PieChart
              v-else-if="usersByRoleLabels.length > 0"
              :labels="usersByRoleLabels"
              :data="usersByRoleData"
              :colors="usersByRoleColors"
            />
            <div v-else class="text-center py-5 text-muted">
              <PieChartIcon :size="48" class="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <Calendar :size="20" class="me-2" />
              Monthly Appointments
            </h5>
            <small class="text-muted">Last 6 months</small>
          </div>
          <div class="card-body">
            <div v-if="chartLoading.monthlyAppointments" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <BarChart
              v-else-if="monthlyAppointmentsLabels.length > 0"
              :labels="monthlyAppointmentsLabels"
              :data="monthlyAppointmentsData"
              label="Appointments"
              background-color="#28a745"
            />
            <div v-else class="text-center py-5 text-muted">
              <BarChart2 :size="48" class="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <Activity :size="20" class="me-2" />
              Appointment Status
            </h5>
          </div>
          <div class="card-body">
            <div v-if="chartLoading.appointmentsByStatus" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <PieChart
              v-else-if="appointmentsByStatusLabels.length > 0"
              :labels="appointmentsByStatusLabels"
              :data="appointmentsByStatusData"
              :colors="appointmentsByStatusColors"
            />
            <div v-else class="text-center py-5 text-muted">
              <PieChartIcon :size="48" class="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <Layers :size="20" class="me-2" />
              Appointments by Service Type
            </h5>
          </div>
          <div class="card-body">
            <div v-if="chartLoading.appointmentsByService" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>
            <BarChart
              v-else-if="appointmentsByServiceLabels.length > 0"
              :labels="appointmentsByServiceLabels"
              :data="appointmentsByServiceData"
              :background-color="appointmentsByServiceColors"
              label="Appointments"
              :horizontal="true"
            />
            <div v-else class="text-center py-5 text-muted">
              <BarChart2 :size="48" class="mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, CircleAlert as AlertCircle, TrendingUp, Users, Calendar, Activity, Layers, ChartBar as BarChart2, ChartPie as PieChartIcon } from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import { useChartData } from '@/composables/useChartData'

const chartData = useChartData()

const isLoading = ref(false)
const error = ref('')

const chartLoading = ref({
  userTrend: false,
  monthlyAppointments: false,
  appointmentsByService: false,
  appointmentsByStatus: false,
  usersByRole: false
})

const userTrendLabels = ref<string[]>([])
const userTrendData = ref<number[]>([])

const monthlyAppointmentsLabels = ref<string[]>([])
const monthlyAppointmentsData = ref<number[]>([])

const appointmentsByServiceLabels = ref<string[]>([])
const appointmentsByServiceData = ref<number[]>([])
const appointmentsByServiceColors = ref<string[]>([])

const appointmentsByStatusLabels = ref<string[]>([])
const appointmentsByStatusData = ref<number[]>([])
const appointmentsByStatusColors = ref<string[]>([])

const usersByRoleLabels = ref<string[]>([])
const usersByRoleData = ref<number[]>([])
const usersByRoleColors = ref<string[]>([])

const loadUserRegistrationTrend = async () => {
  chartLoading.value.userTrend = true

  try {
    const data = await chartData.loadUserRegistrationTrend(6)

    userTrendLabels.value = data.map(d =>
      d.date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
    )
    userTrendData.value = data.map(d => d.value)
  } catch (err) {
    console.error('Error loading user trend:', err)
  } finally {
    chartLoading.value.userTrend = false
  }
}

const loadMonthlyAppointments = async () => {
  chartLoading.value.monthlyAppointments = true

  try {
    const data = await chartData.loadMonthlyAppointments(6)

    monthlyAppointmentsLabels.value = data.map(d =>
      d.date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
    )
    monthlyAppointmentsData.value = data.map(d => d.value)
  } catch (err) {
    console.error('Error loading monthly appointments:', err)
  } finally {
    chartLoading.value.monthlyAppointments = false
  }
}

const loadAppointmentsByService = async () => {
  chartLoading.value.appointmentsByService = true

  try {
    const data = await chartData.loadAppointmentsByService()

    appointmentsByServiceLabels.value = data.map(d => d.label)
    appointmentsByServiceData.value = data.map(d => d.value)
    appointmentsByServiceColors.value = data.map(d => d.color || '#0066CC')
  } catch (err) {
    console.error('Error loading appointments by service:', err)
  } finally {
    chartLoading.value.appointmentsByService = false
  }
}

const loadAppointmentsByStatus = async () => {
  chartLoading.value.appointmentsByStatus = true

  try {
    const data = await chartData.loadAppointmentsByStatus()

    appointmentsByStatusLabels.value = data.map(d => d.label)
    appointmentsByStatusData.value = data.map(d => d.value)
    appointmentsByStatusColors.value = data.map(d => d.color || '#6c757d')
  } catch (err) {
    console.error('Error loading appointments by status:', err)
  } finally {
    chartLoading.value.appointmentsByStatus = false
  }
}

const loadUsersByRole = async () => {
  chartLoading.value.usersByRole = true

  try {
    const data = await chartData.loadUsersByRole()

    usersByRoleLabels.value = data.map(d => d.label)
    usersByRoleData.value = data.map(d => d.value)
    usersByRoleColors.value = data.map(d => d.color || '#0066CC')
  } catch (err) {
    console.error('Error loading users by role:', err)
  } finally {
    chartLoading.value.usersByRole = false
  }
}

const loadAllCharts = async () => {
  await Promise.all([
    loadUserRegistrationTrend(),
    loadMonthlyAppointments(),
    loadAppointmentsByService(),
    loadAppointmentsByStatus(),
    loadUsersByRole()
  ])
}

const refreshAllData = () => {
  isLoading.value = true
  loadAllCharts().finally(() => {
    isLoading.value = false
  })
}

onMounted(() => {
  loadAllCharts()
})
</script>

<style scoped>
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

.card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1rem 1.5rem;
}

.card-body {
  padding: 1.5rem;
}
</style>
