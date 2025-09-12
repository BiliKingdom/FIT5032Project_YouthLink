<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container-fluid">
      <router-link to="/admin" class="navbar-brand d-flex align-items-center">
        <div class="logo-icon me-2">
          <Shield class="text-warning" :size="28" />
        </div>
        <span class="fw-bold text-warning">MindWell Admin</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#adminNavbar"
        aria-controls="adminNavbar" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="adminNavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link to="/admin" class="nav-link">
              <BarChart class="me-1" :size="16" />
              Dashboard
            </router-link>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <Users class="me-1" :size="16" />
              User Management
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="#" @click="navigateToUserList">All Users</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToUserRegistrations">New Registrations</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToUserReports">User Reports</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <BookOpen class="me-1" :size="16" />
              Content Management
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="#" @click="navigateToResources">Resources</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToEvents">Events</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToArticles">Articles</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <Calendar class="me-1" :size="16" />
              Appointments
            </a>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="#" @click="navigateToAppointments">All Appointments</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToPendingAppointments">Pending</a></li>
              <li><a class="dropdown-item" href="#" @click="navigateToSchedule">Schedule</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="navigateToReports">
              <TrendingUp class="me-1" :size="16" />
              Reports
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" @click="navigateToSettings">
              <Settings class="me-1" :size="16" />
              Settings
            </a>
          </li>
        </ul>

        <div class="navbar-nav">
          <!-- Quick Actions -->
          <div class="nav-item dropdown me-3">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
              <Zap class="me-1" :size="16" />
              Quick Actions
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li><a class="dropdown-item" href="#" @click="sendBulkEmail">Send Bulk Email</a></li>
              <li><a class="dropdown-item" href="#" @click="createEvent">Create Event</a></li>
              <li><a class="dropdown-item" href="#" @click="addResource">Add Resource</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="exportData">Export Data</a></li>
            </ul>
          </div>

          <!-- Admin Profile -->
          <div class="dropdown">
            <a 
              class="nav-link dropdown-toggle d-flex align-items-center" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <div class="admin-avatar bg-warning text-dark rounded-circle me-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                <User :size="18" />
              </div>
              {{ authStore.user?.displayName }}
              <span class="badge bg-warning text-dark ms-2">Admin</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li><a class="dropdown-item" href="#" @click="viewProfile">Admin Profile</a></li>
              <li><a class="dropdown-item" href="#" @click="viewPublicSite">View Public Site</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click="logout">
                <LogOut class="me-1" :size="16" />
                Logout
              </a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { 
  Shield, BarChart, Users, BookOpen, Calendar, TrendingUp, 
  Settings, Zap, User, LogOut 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// Navigation methods
const navigateToUserList = () => console.log('Navigate to user list')
const navigateToUserRegistrations = () => console.log('Navigate to user registrations')
const navigateToUserReports = () => console.log('Navigate to user reports')
const navigateToResources = () => console.log('Navigate to resources management')
const navigateToEvents = () => console.log('Navigate to events management')
const navigateToArticles = () => console.log('Navigate to articles management')
const navigateToAppointments = () => console.log('Navigate to appointments')
const navigateToPendingAppointments = () => console.log('Navigate to pending appointments')
const navigateToSchedule = () => console.log('Navigate to schedule')
const navigateToReports = () => console.log('Navigate to reports')
const navigateToSettings = () => console.log('Navigate to settings')

// Quick actions
const sendBulkEmail = () => console.log('Send bulk email')
const createEvent = () => console.log('Create event')
const addResource = () => console.log('Add resource')
const exportData = () => console.log('Export data')

// Profile actions
const viewProfile = () => console.log('View admin profile')
const viewPublicSite = () => router.push('/')
const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar-brand {
  font-size: 1.5rem;
  text-decoration: none;
}

.nav-link {
  font-weight: 500;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: var(--bs-warning) !important;
}

.dropdown-menu-dark {
  background-color: #343a40;
  border: 1px solid #495057;
}

.dropdown-menu-dark .dropdown-item {
  color: #fff;
}

.dropdown-menu-dark .dropdown-item:hover {
  background-color: #495057;
  color: var(--bs-warning);
}

.admin-avatar {
  font-size: 0.875rem;
  font-weight: bold;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    margin-top: 1rem;
  }
}
</style>