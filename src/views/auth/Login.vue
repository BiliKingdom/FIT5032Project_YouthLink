<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-5 col-md-7">
        <div class="text-center mb-4">
          <div class="mb-3">
            <Heart class="text-primary" :size="48" />
          </div>
          <h1 class="h3 fw-bold">Welcome Back</h1>
          <p class="text-muted">Sign in to access your MindWell account</p>
        </div>

        <div class="card shadow border-0">
          <div class="card-body p-4">
            <form @submit.prevent="handleLogin" novalidate>
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  id="email"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': errors.email }"
                  required
                  autocomplete="username"
                  @blur="validateEmail"
                >
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': errors.password }"
                    required
                    autocomplete="current-password"
                    minlength="6"
                    @blur="validatePassword"
                  >
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="showPassword = !showPassword"
                  >
                    <Eye v-if="!showPassword" :size="16" />
                    <EyeOff v-else :size="16" />
                  </button>
                </div>
                <div v-if="errors.password" class="invalid-feedback d-block">{{ errors.password }}</div>
              </div>

              <div class="mb-3 form-check">
                <input
                  v-model="form.rememberMe"
                  type="checkbox"
                  id="rememberMe"
                  class="form-check-input"
                >
                <label for="rememberMe" class="form-check-label">
                  Remember me
                </label>
              </div>

              <div v-if="loginError" class="alert alert-danger">
                <AlertCircle class="me-2" :size="16" />
                {{ loginError }}
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 mb-3"
                :disabled="authStore.loading || !isFormValid"
              >
                <div v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></div>
                <LogIn class="me-2" :size="18" />
                {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
              </button>

              <div class="text-center">
                <p class="text-muted mb-0">
                  Don't have an account? 
                  <router-link to="/auth/register" class="text-decoration-none">
                    Create one here
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Demo Accounts Info -->
        <div class="card mt-4 border-info">
          <div class="card-header bg-info bg-opacity-10">
            <h6 class="mb-0 text-info">
              <Info class="me-2" :size="16" />
              Demo Accounts
            </h6>
          </div>
          <div class="card-body p-3">
            <div class="row g-2 text-sm">
              <div class="col-12">
                <strong>Admin Account:</strong><br>
                <code>admin@mindwellnfp.org</code> / <code>password</code>
              </div>
              <div class="col-12">
                <strong>User Account:</strong><br>
                <code>user@example.com</code> / <code>password</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Eye, EyeOff, LogIn, AlertCircle, Info } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

interface LoginForm {
  email: string
  password: string
  rememberMe: boolean
}

const router = useRouter()
const authStore = useAuthStore()

const form = ref<LoginForm>({
  email: '',
  password: '',
  rememberMe: false
})

const errors = ref({
  email: '',
  password: ''
})

const showPassword = ref(false)
const loginError = ref('')

const isFormValid = computed(() => {
  return form.value.email.includes('@') && 
         form.value.password.length >= 6 && 
         !errors.value.email && 
         !errors.value.password
})

const validateEmail = () => {
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  } else {
    errors.value.email = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  } else {
    errors.value.password = ''
  }
}

const handleLogin = async () => {
  validateEmail()
  validatePassword()
  
  if (!isFormValid.value) {
    return
  }
  
  loginError.value = ''
  
  const result = await authStore.login(form.value.email, form.value.password)
  
  if (result.success) {
    router.push('/')
  } else {
    loginError.value = result.error || 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

code {
  background-color: rgba(var(--bs-primary-rgb), 0.1);
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.875em;
}

.text-sm {
  font-size: 0.875rem;
}
</style>