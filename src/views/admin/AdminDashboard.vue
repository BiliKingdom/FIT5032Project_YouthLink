<template>
  <div class="container-fluid py-4">
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="display-6 fw-bold mb-2">Admin Dashboard</h1>
        <p class="text-muted">Welcome back, {{ authStore.user?.displayName }}! Manage your mental health platform</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary">
          <Download class="me-2" :size="16" />
          Export Data
        </button>
        <button class="btn btn-primary">
          <Plus class="me-2" :size="16" />
          Add Content
        </button>
      </div>
    </div>

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

      <div class="col-md-3">
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
      </div>

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

      <div class="col-md-3">
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
      </div>
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
            <div class="chart-placeholder bg-light d-flex align-items-center justify-content-center" style="height: 300px;">
              <div class="text-center">
                <BarChart class="text-muted mb-3" :size="48" />
                <h5 class="text-muted">Chart Integration Coming Soon</h5>
                <p class="text-muted">Chart.js integration will be implemented in the next phase</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="col-lg-4">
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
      </div>

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
                <button class="btn btn-outline-primary w-100">
                  <Mail class="mb-2" :size="20" />
                  <div>Send Bulk Email</div>
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-outline-success w-100">
                  <Calendar class="mb-2" :size="20" />
                  <div>Manage Events</div>
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-outline-warning w-100">
                  <BookOpen class="mb-2" :size="20" />
                  <div>Add Resource</div>
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-outline-info w-100">
                  <Users class="mb-2" :size="20" />
                  <div>User Management</div>
                </button>
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
import { 
  Users, Calendar, BookOpen, Star, TrendingUp, BarChart, Activity, 
  Zap, Mail, Shield, Download, Plus 
} from 'lucide-vue-next'

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
  totalUsers: 1247,
  totalAppointments: 89,
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

onMounted(() => {
  // Load admin dashboard data
  console.log('Admin dashboard loaded')
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