<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-lg-6 col-md-8">
        <div class="text-center mb-4">
          <div class="mb-3">
            <Heart class="text-primary" :size="48" />
          </div>
          <h1 class="h3 fw-bold">Create Your Account</h1>
          <p class="text-muted">Join MindWell NFP to access personalized mental health resources</p>
        </div>

        <div class="card shadow border-0">
          <div class="card-body p-4">
            <form @submit.prevent="handleRegister" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="displayName" class="form-label">Full Name</label>
                  <input
                    v-model="form.displayName"
                    type="text"
                    id="displayName"
                    class="form-control"
                    :class="{ 'is-invalid': errors.displayName }"
                    required
                    minlength="2"
                    @blur="validateDisplayName"
                  >
                  <div v-if="errors.displayName" class="invalid-feedback">{{ errors.displayName }}</div>
                </div>

                <div class="col-md-6">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    v-model="form.email"
                    type="email"
                    id="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    required
                    autocomplete="username"
                    @blur="validateEmail"
                  >
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>

                <div class="col-md-6">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      class="form-control"
                      :class="{ 'is-invalid': errors.password }"
                      required
                      minlength="8"
                      autocomplete="new-password"
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
                  <div class="form-text">
                    Password must be at least 8 characters with one uppercase, lowercase, and number
                  </div>
                </div>

                
                <div class="col-md-6">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    v-model="form.confirmPassword"
                    type="password"
                    id="confirmPassword"
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    required
                    autocomplete="new-password"
                    @blur="validateConfirmPassword"
                  >
                  <div v-if="errors.confirmPassword" class="invalid-feedback">{{ errors.confirmPassword }}</div>
                </div>
  


                <div class="col-12">
                  <label for="dateOfBirth" class="form-label">Date of Birth</label>
                  <input
                    v-model="form.dateOfBirth"
                    type="date"
                    id="dateOfBirth"
                    class="form-control"
                    :class="{ 'is-invalid': errors.dateOfBirth }"
                    :max="maxDate"
                    required
                    @blur="validateDateOfBirth"
                  >
                  <div v-if="errors.dateOfBirth" class="invalid-feedback">{{ errors.dateOfBirth }}</div>
                  <div class="form-text">You must be at least 13 years old to create an account</div>
                </div>

                <div class="col-12">
                  <div class="form-check">
                    <input
                      v-model="form.agreeToTerms"
                      type="checkbox"
                      id="agreeToTerms"
                      class="form-check-input"
                      :class="{ 'is-invalid': errors.agreeToTerms }"
                      required
                      @change="validateAgreeToTerms"
                    >
                    <label for="agreeToTerms" class="form-check-label">
                      I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and 
                      <a href="#" class="text-decoration-none">Privacy Policy</a>
                    </label>
                    <div v-if="errors.agreeToTerms" class="invalid-feedback d-block">{{ errors.agreeToTerms }}</div>
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-check">
                    <input
                      v-model="form.subscribeNewsletter"
                      type="checkbox"
                      id="subscribeNewsletter"
                      class="form-check-input"
                    >
                    <label for="subscribeNewsletter" class="form-check-label">
                      Subscribe to our newsletter for mental health tips and updates
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="registerError" class="alert alert-danger mt-3">
                <AlertCircle class="me-2" :size="16" />
                {{ registerError }}
              </div>

              <button
                type="submit"
                class="btn btn-primary btn-lg w-100 mt-4"
                :disabled="authStore.loading || !isFormValid"
              >
                <div v-if="authStore.loading" class="spinner-border spinner-border-sm me-2"></div>
                <UserPlus class="me-2" :size="18" />
                {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
              </button>

              <div class="text-center mt-3">
                <p class="text-muted mb-0">
                  Already have an account? 
                  <router-link to="/auth/login" class="text-decoration-none">
                    Sign in here
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'

interface RegisterForm {
  displayName: string
  email: string
  password: string
  confirmPassword: string 

  dateOfBirth: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

const router = useRouter()
const authStore = useAuthStore()

const form = ref<RegisterForm>({
  displayName: '',
  email: '',
  password: '',

  dateOfBirth: '',
  agreeToTerms: false,
  subscribeNewsletter: false
})

const errors = ref({
  displayName: '',
  email: '',
  password: '',

  dateOfBirth: '',
  agreeToTerms: ''
})

const showPassword = ref(false)
const registerError = ref('')

// Calculate max date (13 years ago)
const maxDate = computed(() => {
  const date = new Date()
  date.setFullYear(date.getFullYear() - 13)
  return date.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return form.value.displayName.length >= 2 &&
         form.value.email.includes('@') &&
         form.value.password.length >= 8 &&
         form.value.password === form.value.confirmPassword &&
         form.value.dateOfBirth &&
         form.value.agreeToTerms &&
         Object.values(errors.value).every(error => !error)
})

const validateDisplayName = () => {
  if (!form.value.displayName) {
    errors.value.displayName = 'Full name is required'
  } else if (form.value.displayName.length < 2) {
    errors.value.displayName = 'Name must be at least 2 characters'
  } else {
    errors.value.displayName = ''
  }
}

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
  const password = form.value.password
  if (!password) {
    errors.value.password = 'Password is required'
  } else if (password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.value.password = 'Password must contain uppercase, lowercase, and number'
  } else {
    errors.value.password = ''
  }
  
  // Re-validate confirm password if it's filled
  if (form.value.confirmPassword) {
    validateConfirmPassword()
  }
}

const validateConfirmPassword = () => {
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password'
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
  } else {
    errors.value.confirmPassword = ''
  }
}

const validateDateOfBirth = () => {
  if (!form.value.dateOfBirth) {
    errors.value.dateOfBirth = 'Date of birth is required'
  } else {
    const birthDate = new Date(form.value.dateOfBirth)
    const minAge = new Date()
    minAge.setFullYear(minAge.getFullYear() - 13)
    
    if (birthDate > minAge) {
      errors.value.dateOfBirth = 'You must be at least 13 years old'
    } else {
      errors.value.dateOfBirth = ''
    }
  }
}

const validateAgreeToTerms = () => {
  if (!form.value.agreeToTerms) {
    errors.value.agreeToTerms = 'You must agree to the terms and conditions'
  } else {
    errors.value.agreeToTerms = ''
  }
}

const handleRegister = async () => {
  // Validate all fields
  validateDisplayName()
  validateEmail()
  validatePassword()
  validateConfirmPassword()
  validateDateOfBirth()
  validateAgreeToTerms()
  
  if (!isFormValid.value) {
    return
  }
  
  registerError.value = ''
  
  const result = await authStore.register(
    form.value.email,
    form.value.password,
    form.value.displayName
  )
  
  if (result.success) {
    // Store additional registration data
    const userData = {
      dateOfBirth: form.value.dateOfBirth,
      subscribeNewsletter: form.value.subscribeNewsletter,
      registrationDate: new Date().toISOString()
    }
    localStorage.setItem('userProfile', JSON.stringify(userData))
    
    router.push('/')
  } else {
    registerError.value = result.error || 'Registration failed. Please try again.'
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

.form-text {
  font-size: 0.875rem;
}

a {
  color: var(--bs-primary);
}

a:hover {
  color: #0056b3;
}
</style>