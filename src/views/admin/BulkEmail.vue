<template>
  <div class="container-fluid py-4">
    <div class="row mb-4">
      <div class="col">
        <h2 class="mb-3">
          <Mail class="me-2" :size="32" />
          Bulk Email
        </h2>
        <p class="text-muted">Send emails to multiple users at once</p>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">Compose Email</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="sendBulkEmails">
              <div class="mb-3">
                <label for="subject" class="form-label">Subject *</label>
                <input
                  v-model="emailForm.subject"
                  type="text"
                  class="form-control"
                  id="subject"
                  placeholder="Enter email subject"
                  required
                  maxlength="200"
                />
              </div>

              <div class="mb-3">
                <label for="message" class="form-label">Message *</label>
                <textarea
                  v-model="emailForm.message"
                  class="form-control"
                  id="message"
                  rows="10"
                  placeholder="Enter your message here..."
                  required
                  maxlength="5000"
                ></textarea>
                <div class="form-text">{{ emailForm.message.length }}/5000 characters</div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="text-muted">
                    <Users class="me-1" :size="16" />
                    {{ selectedUsers.length }} recipient(s) selected
                  </span>
                </div>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="sending || selectedUsers.length === 0 || !emailForm.subject || !emailForm.message"
                >
                  <div v-if="sending" class="spinner-border spinner-border-sm me-2"></div>
                  <Send class="me-1" :size="16" />
                  {{ sending ? 'Sending...' : 'Send Emails' }}
                </button>
              </div>
            </form>

            <div v-if="sendResult" class="alert mt-4" :class="sendResult.success ? 'alert-success' : 'alert-warning'">
              <div class="d-flex align-items-center mb-2">
                <CheckCircle v-if="sendResult.success" class="me-2" :size="20" />
                <AlertCircle v-else class="me-2" :size="20" />
                <strong>Send Results</strong>
              </div>
              <p class="mb-1">Successfully sent: {{ sendResult.sentCount }}</p>
              <p class="mb-1">Failed: {{ sendResult.failedCount }}</p>
              <div v-if="sendResult.errors.length > 0" class="mt-2">
                <small class="text-muted">Errors:</small>
                <ul class="small mb-0">
                  <li v-for="(error, index) in sendResult.errors" :key="index">{{ error }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-header bg-secondary text-white">
            <h6 class="mb-0">Select Recipients</h6>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <button
                type="button"
                class="btn btn-sm btn-outline-primary me-2"
                @click="selectAllUsers"
              >
                Select All
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-secondary"
                @click="clearSelection"
              >
                Clear All
              </button>
            </div>

            <div class="mb-3">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control form-control-sm"
                placeholder="Search users..."
              />
            </div>

            <div v-if="loading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div v-else class="user-list" style="max-height: 500px; overflow-y: auto;">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                class="form-check mb-2"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :value="user.id"
                  :id="`user-${user.id}`"
                  v-model="selectedUserIds"
                />
                <label class="form-check-label" :for="`user-${user.id}`">
                  <div class="d-flex flex-column">
                    <span class="fw-bold">{{ user.displayName || 'No Name' }}</span>
                    <small class="text-muted">{{ user.email }}</small>
                  </div>
                </label>
              </div>

              <div v-if="filteredUsers.length === 0" class="text-center text-muted py-3">
                No users found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Mail, Send, Users, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { emailService } from '@/services/emailService'

interface User {
  id: string
  email: string
  displayName: string
  role?: string
}

const loading = ref(false)
const sending = ref(false)
const users = ref<User[]>([])
const selectedUserIds = ref<string[]>([])
const searchQuery = ref('')
const sendResult = ref<{ success: boolean; sentCount: number; failedCount: number; errors: string[] } | null>(null)

const emailForm = ref({
  subject: '',
  message: ''
})

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value

  const query = searchQuery.value.toLowerCase()
  return users.value.filter(
    user =>
      user.displayName?.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  )
})

const selectedUsers = computed(() => {
  return users.value.filter(user => selectedUserIds.value.includes(user.id))
})

const loadUsers = async () => {
  loading.value = true
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    users.value = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User))
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    loading.value = false
  }
}

const selectAllUsers = () => {
  selectedUserIds.value = filteredUsers.value.map(user => user.id)
}

const clearSelection = () => {
  selectedUserIds.value = []
}

const sendBulkEmails = async () => {
  if (selectedUsers.value.length === 0) {
    alert('Please select at least one recipient')
    return
  }

  if (!emailForm.value.subject || !emailForm.value.message) {
    alert('Please fill in both subject and message')
    return
  }

  if (!confirm(`Send this email to ${selectedUsers.value.length} user(s)?`)) {
    return
  }

  sending.value = true
  sendResult.value = null

  try {
    const recipients = selectedUsers.value.map(user => ({
      email: user.email,
      name: user.displayName || 'User'
    }))

    const result = await emailService.sendBulkEmails(
      recipients,
      emailForm.value.subject,
      emailForm.value.message
    )

    sendResult.value = result

    if (result.success) {
      emailForm.value.subject = ''
      emailForm.value.message = ''
      selectedUserIds.value = []
    }
  } catch (error) {
    console.error('Error sending bulk emails:', error)
    alert('An error occurred while sending emails')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-list {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
}

.form-check {
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.form-check:hover {
  background-color: #f8f9fa;
}

.form-check-input:checked ~ .form-check-label {
  font-weight: 500;
}
</style>
