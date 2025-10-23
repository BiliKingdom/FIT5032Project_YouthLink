<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="display-6 fw-bold mb-2">Admin Dashboard</h1>
        <p class="text-muted">Welcome back, {{ authStore.user?.displayName }}! Manage your mental health platform</p>
      </div>
      <!-- <div class="d-flex gap-2">
        <button class="btn btn-outline-primary">
          <Download class="me-2" :size="16" />
          Export Data
        </button>
        <button 
          class="btn btn-primary"
          @click="handleInitializeDatabase"
          :disabled="initializingDatabase || databaseInitialized"
        >
          <div v-if="initializingDatabase" class="spinner-border spinner-border-sm me-2"></div>
          <Plus class="me-2" :size="16" />
          {{ initializingDatabase ? 'Initializing...' : databaseInitialized ? 'Database Ready' : 'Initialize Database' }}
        </button>
      </div> -->
    </div>

    <!-- Database Initialization Alert -->
    <!-- <div v-if="!databaseInitialized && !initializingDatabase" class="alert alert-info mb-4">
      <div class="d-flex align-items-center">
        <AlertCircle class="me-2" :size="20" />
        <div class="flex-grow-1">
          <strong>Database Setup Required</strong>
          <p class="mb-0">Click "Initialize Database" to set up sample data including mental health resources, service locations, and system settings.</p>
        </div>
      </div>
    </div> -->
    <!-- Stats Cards -->
    <div class="row g-4 mb-5">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-primary bg-opacity-10 rounded p-2 me-3">
                <Users class="text-primary" :size="24" />
              </div>
              <div>
                <h3 class="fw-bold mb-0">{{ stats.totalUsers }}</h3>
                <p class="text-muted small mb-0">Total Users</p>
                <small class="text-success">+12% this month</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-success bg-opacity-10 rounded p-2 me-3">
                <Calendar class="text-success" :size="24" />
              </div>
              <div>
                <h3 class="fw-bold mb-0">{{ stats.totalAppointments }}</h3>
                <p class="text-muted small mb-0">Appointments</p>
                <small class="text-success">+8% this week</small>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-warning bg-opacity-10 rounded p-2 me-3">
                <BookOpen class="text-warning" :size="24" />
              </div>
              <div>
                <h3 class="fw-bold mb-0">{{ stats.totalResources }}</h3>
                <p class="text-muted small mb-0">Resources</p>
                <small class="text-info">{{ stats.newResources }} new</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="col-md-3">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="stat-icon bg-info bg-opacity-10 rounded p-2 me-3">
                <Star class="text-info" :size="24" />
              </div>
              <div>
                <h3 class="fw-bold mb-0">{{ stats.averageRating }}</h3>
                <p class="text-muted small mb-0">Avg Rating</p>
                <small class="text-success">+0.2 this month</small>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>

    <div class="row g-4">
      <!-- User Registration Chart -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">
              <TrendingUp class="me-2" :size="20" />
              User Registration Trends
            </h5>
          </div>
          <div class="card-body">
            <div v-if="chartLoading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
              <p class="text-muted mt-2">Loading chart data...</p>
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
              <BarChart class="mb-2 opacity-50" :size="48" />
              <p>No user registration data available</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <!-- <div class="col-lg-4">
        <div class="card border-0 shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">
              <Activity class="me-2" :size="20" />
              Recent Activity
            </h5>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div v-for="activity in recentActivity" :key="activity.id" class="activity-item d-flex align-items-start mb-3">
                <div class="activity-icon me-3">
                  <component :is="activity.icon" :size="16" :class="activity.iconClass" />
                </div>
                <div class="flex-grow-1">
                  <p class="mb-1 small">{{ activity.description }}</p>
                  <small class="text-muted">{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Quick Actions -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">
              <Zap class="me-2" :size="20" />
              Quick Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div class="col-6">
                <router-link to="/admin/bulk-email" class="btn btn-outline-danger w-100">
                  <Mail class="mb-2" :size="20" />
                  <div>Bulk Email</div>
                </router-link>
              </div>
              <div class="col-6">
                <router-link to="/admin/course-instances" class="btn btn-outline-info w-100">
                  <Calendar class="mb-2" :size="20" />
                  <div>Course Instances</div>
                </router-link>
              </div>
              <!-- <div class="col-6">
                <router-link to="/admin/appointments" class="btn btn-outline-success w-100">
                  <Calendar class="mb-2" :size="20" />
                  <div>Appointments</div>
                </router-link>
              </div> -->
              <div class="col-6">
                <router-link to="/admin/analytics" class="btn btn-outline-warning w-100">
                  <BarChart class="mb-2" :size="20" />
                  <div>Analytics</div>
                </router-link>
              </div>
              <div class="col-6">
                <router-link to="/admin/courses" class="btn btn-outline-info w-100">
                  <BookOpen class="mb-2" :size="20" />
                  <div>Course Management</div>
                </router-link>
              </div>
              <div class="col-6">

                <!-- <router-link to="/admin/users" class="btn btn-outline-primary w-100">
                  <Users class="mb-2" :size="20" />
                  <div>User Management</div>
                </router-link> -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- System Status -->
      <div class="col-lg-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header">
            <h5 class="mb-0">
              <Shield class="me-2" :size="20" />
              System Status
            </h5>
          </div>
          <div class="card-body">
            <div class="status-list">
              <div v-for="status in systemStatus" :key="status.name" class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex align-items-center">
                  <div class="status-indicator me-2" :class="status.statusClass"></div>
                  <span>{{ status.name }}</span>
                </div>
                <span class="badge" :class="status.badgeClass">{{ status.status }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, Calendar, BookOpen, Star, TrendingUp, ChartBar as BarChart, Activity, Zap, Mail, Shield, Download, Plus, CircleAlert as AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { appointmentsService, contactService, userService } from '@/services/firestore'
import { initializeDatabase, checkDatabaseStatus } from '@/services/initializeDatabase'
import LineChart from '@/components/charts/LineChart.vue'
import { useChartData } from '@/composables/useChartData'

const authStore = useAuthStore()

interface Stats {
  totalUsers: number
  totalAppointments: number
  totalResources: number
  newResources: number
  averageRating: number
}

interface ActivityItem {
  id: number
  description: string
  time: string
  icon: any
  iconClass: string
}

interface SystemStatusItem {
  name: string
  status: string
  statusClass: string
  badgeClass: string
}

const stats = ref<Stats>({
  totalUsers: 0,
  totalAppointments: 0,
  totalResources: 156,
  newResources: 12,
  averageRating: 4.6
})

const recentActivity = ref<ActivityItem[]>([
  {
    id: 1,
    description: 'New user registration: Sarah Johnson',
    time: '2 minutes ago',
    icon: Users,
    iconClass: 'text-success'
  },
  {
    id: 2,
    description: 'Appointment booked for anxiety counseling',
    time: '15 minutes ago',
    icon: Calendar,
    iconClass: 'text-primary'
  },
  {
    id: 3,
    description: 'New resource added: Stress Management Guide',
    time: '1 hour ago',
    icon: BookOpen,
    iconClass: 'text-warning'
  },
  {
    id: 4,
    description: 'Contact form submission received',
    time: '2 hours ago',
    icon: Mail,
    iconClass: 'text-info'
  },
  {
    id: 5,
    description: 'User rated resource: 5 stars',
    time: '3 hours ago',
    icon: Star,
    iconClass: 'text-warning'
  }
])

const systemStatus = ref<SystemStatusItem[]>([
  {
    name: 'Website',
    status: 'Online',
    statusClass: 'bg-success',
    badgeClass: 'bg-success'
  },
  {
    name: 'Database',
    status: 'Online',
    statusClass: 'bg-success',
    badgeClass: 'bg-success'
  },
  {
    name: 'Email Service',
    status: 'Online',
    statusClass: 'bg-success',
    badgeClass: 'bg-success'
  },
  {
    name: 'Backup System',
    status: 'Warning',
    statusClass: 'bg-warning',
    badgeClass: 'bg-warning'
  }
])

const initializingDatabase = ref(false)
const databaseInitialized = ref(false)
const chartLoading = ref(false)
const userTrendLabels = ref<string[]>([])
const userTrendData = ref<number[]>([])

const chartData = useChartData()

const loadDashboardData = async () => {
  try {
    // Load users count
    const usersResult = await userService.getAll()
    if (usersResult.success) {
      stats.value.totalUsers = usersResult.data?.length || 0
    }
    
    // Load appointments count
    const appointmentsResult = await appointmentsService.getAll()
    if (appointmentsResult.success) {
      stats.value.totalAppointments = appointmentsResult.data?.length || 0
    }
    
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
}

const handleInitializeDatabase = async () => {
  initializingDatabase.value = true
  try {
    const result = await initializeDatabase()
    if (result.success) {
      databaseInitialized.value = true
      // Reload dashboard data
      await loadDashboardData()
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  } finally {
    initializingDatabase.value = false
  }
}

const loadUserRegistrationChart = async () => {
  chartLoading.value = true
  try {
    const data = await chartData.loadUserRegistrationTrend(6)
    userTrendLabels.value = data.map(d =>
      d.date.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
    )
    userTrendData.value = data.map(d => d.value)
  } catch (error) {
    console.error('Error loading user registration chart:', error)
  } finally {
    chartLoading.value = false
  }
}

const checkDatabase = async () => {
  try {
    const status = await checkDatabaseStatus()
    if (!status.needsInitialization) {
      databaseInitialized.value = true
    }
  } catch (error) {
    console.error('Error checking database status:', error)
  }
}
onMounted(() => {
  checkDatabase()
  loadDashboardData()
  loadUserRegistrationChart()
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

.chart-placeholder {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>