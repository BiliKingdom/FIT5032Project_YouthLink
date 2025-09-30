<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="text-center mb-5">
          <div class="profile-avatar bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
            <User class="text-primary" :size="48" />
          </div>
          <h1 class="display-6 fw-bold mb-2">My Profile</h1>
          <p class="text-muted">Manage your account settings and preferences</p>
        </div>

        <div class="row g-4">
          <!-- Profile Information -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0">
              <div class="card-header">
                <h5 class="mb-0">
                  <User class="me-2" :size="20" />
                  Profile Information
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label fw-medium">Display Name</label>
                  <p class="text-muted">{{ authStore.user?.displayName || 'Not provided' }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Email Address</label>
                  <p class="text-muted">{{ authStore.user?.email || 'Not provided' }}</p>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Account Type</label>
                  <span class="badge" :class="authStore.isAdmin ? 'bg-danger' : 'bg-primary'">
                    {{ authStore.user?.role === 'admin' ? 'Administrator' : 'User' }}
                  </span>
                </div>
                <div class="mb-3">
                  <label class="form-label fw-medium">Member Since</label>
                  <p class="text-muted">{{ formatDate(authStore.user?.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- My Appointments -->
          <div class="col-md-6">
            <div class="card shadow-sm border-0">
              <div class="card-header">
                <h5 class="mb-0">
                  <Calendar class="me-2" :size="20" />
                  My Appointments
                </h5>
              </div>
              <div class="card-body">
                <div v-if="appointments.length > 0">
                  <div v-for="appointment in appointments" :key="appointment.id" class="appointment-item mb-3 p-3 bg-light rounded">
                    <div class="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 class="fw-bold mb-1">{{ appointment.serviceType }}</h6>
                        <p class="text-muted small mb-1">
                          {{ formatDate(appointment.preferredDate) }} at {{ appointment.preferredTime }}
                        </p>
                        <span class="badge" :class="getStatusBadgeClass(appointment.status)">
                          {{ appointment.status }}
                        </span>
                      </div>
                      <button
                        v-if="appointment.status === 'pending'"
                        class="btn btn-outline-danger btn-sm"
                        @click="cancelAppointment(appointment.id!)"
                      >
                        <X :size="14" />
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <Calendar class="text-muted mb-2" :size="32" />
                  <p class="text-muted">No appointments scheduled</p>
                  <router-link to="/support/book" class="btn btn-primary btn-sm">
                    Book Appointment
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Settings -->
          <div class="col-12">
            <div class="card shadow-sm border-0">
              <div class="card-header">
                <h5 class="mb-0">
                  <Settings class="me-2" :size="20" />
                  Account Settings
                </h5>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <div class="form-check form-switch">
                      <input 
                        v-model="settings.emailNotifications" 
                        class="form-check-input" 
                        type="checkbox" 
                        id="emailNotifications"
                        @change="saveSettings"
                      >
                      <label class="form-check-label" for="emailNotifications">
                        Email Notifications
                      </label>
                      <div class="form-text">Receive updates about appointments and events</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check form-switch">
                      <input 
                        v-model="settings.newsletter" 
                        class="form-check-input" 
                        type="checkbox" 
                        id="newsletter"
                        @change="saveSettings"
                      >
                      <label class="form-check-label" for="newsletter">
                        Newsletter Subscription
                      </label>
                      <div class="form-text">Monthly mental health tips and resources</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check form-switch">
                      <input 
                        v-model="settings.eventReminders" 
                        class="form-check-input" 
                        type="checkbox" 
                        id="eventReminders"
                        @change="saveSettings"
                      >
                      <label class="form-check-label" for="eventReminders">
                        Event Reminders
                      </label>
                      <div class="form-text">Get notified about upcoming events</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check form-switch">
                      <input 
                        v-model="settings.dataSharing" 
                        class="form-check-input" 
                        type="checkbox" 
                        id="dataSharing"
                        @change="saveSettings"
                      >
                      <label class="form-check-label" for="dataSharing">
                        Anonymous Data Sharing
                      </label>
                      <div class="form-text">Help improve our services through research</div>
                    </div>
                  </div>
                </div>

                <hr class="my-4">

                <div class="d-flex gap-2 flex-wrap">
                  <button class="btn btn-outline-primary">
                    <Edit class="me-2" :size="16" />
                    Edit Profile
                  </button>
                  <button class="btn btn-outline-secondary">
                    <Shield class="me-2" :size="16" />
                    Change Password
                  </button>
                  <button class="btn btn-outline-danger" @click="confirmDeleteAccount">
                    <Trash2 class="me-2" :size="16" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success/Error Messages -->
        <div v-if="message" class="alert mt-4" :class="message.type">
          <CheckCircle v-if="message.type === 'alert-success'" class="me-2" :size="16" />
          <AlertCircle v-else class="me-2" :size="16" />
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  User, Calendar, Settings, Edit, Shield, Trash2, X,
  CheckCircle, AlertCircle 
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { appointmentsService, type Appointment } from '@/services/firestore'


interface UserSettings {
  emailNotifications: boolean
  newsletter: boolean
  eventReminders: boolean
  dataSharing: boolean
}

interface Message {
  type: 'alert-success' | 'alert-danger'
  text: string
}

const authStore = useAuthStore()

const appointments = ref<Appointment[]>([])
const settings = ref<UserSettings>({
  emailNotifications: true,
  newsletter: false,
  eventReminders: true,
  dataSharing: false
})
const message = ref<Message | null>(null)

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Not available'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getStatusBadgeClass = (status: string) => {
  const classes: { [key: string]: string } = {
    'pending': 'bg-warning',
    'confirmed': 'bg-success',
    'cancelled': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const loadAppointments = async () => {
  if (!authStore.user) return
  
  const result = await appointmentsService.getUserAppointments(authStore.user.id)
  if (result.success) {
    appointments.value = result.data || []
  } else {
    console.error('Failed to load appointments:', result.error)
  }
}

const loadSettings = () => {
  const savedSettings = localStorage.getItem('userSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
}

const saveSettings = () => {
  localStorage.setItem('userSettings', JSON.stringify(settings.value))
  showMessage('Settings saved successfully!', 'alert-success')
}

const cancelAppointment = async (appointmentId: string) => {
  const result = await appointmentsService.updateStatus(appointmentId, 'cancelled')
  if (result.success) {
    // Update local state
    const appointment = appointments.value.find(a => a.id === appointmentId)
    if (appointment) {
      appointment.status = 'cancelled'
    }
    showMessage('Appointment cancelled successfully.', 'alert-success')
  } else {
    showMessage('Failed to cancel appointment.', 'alert-danger')
  }
}

const confirmDeleteAccount = () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    // Mock account deletion
    showMessage('Account deletion request submitted. You will receive a confirmation email.', 'alert-success')
  }
}

const showMessage = (text: string, type: 'alert-success' | 'alert-danger') => {
  message.value = { text, type }
  setTimeout(() => {
    message.value = null
  }, 5000)
}

onMounted(() => {
  loadAppointments()
  loadSettings()
})
</script>

<style scoped>
.profile-avatar {
  width: 80px;
  height: 80px;
}

.appointment-item {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.appointment-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.form-check-input:checked {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
}
</style>