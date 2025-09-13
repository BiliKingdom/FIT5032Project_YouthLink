<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-3">Contact Us</h1>
          <p class="lead text-muted">
            Get in touch with our team. We're here to support you and answer any questions.
          </p>
        </div>

        <div class="row g-5">
          <!-- Contact Form -->
          <div class="col-lg-8">
            <div class="card shadow-sm border-0">
              <div class="card-body p-4">
                <h3 class="card-title mb-4">Send us a Message</h3>

                <form @submit.prevent="submitForm" novalidate>
                  <div class="row g-3">
                    <!-- Name -->
                    <div class="col-md-6">
                      <label for="name" class="form-label">Full Name *</label>
                      <input
                        v-model="form.name"
                        type="text"
                        id="name"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name }"
                        required
                        minlength="2"
                        @blur="validateField('name')"
                      >
                      <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
                    </div>


                    <!-- Email -->
                    <div class="col-md-6">
                      <label for="email" class="form-label">Email Address *</label>
                      <input
                        v-model="form.email"
                        type="email"
                        id="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        required
                        @blur="validateField('email')"
                      >
                      <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                    </div>


                    <!-- Phone -->
                    <div class="col-md-6">
                      <label for="phone" class="form-label">Phone Number</label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        id="phone"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                        pattern="[0-9\s\-\+\(\)]+"
                        @blur="validateField('phone')"
                      >
                      <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                    </div>


                    <!-- Subject -->
                    <div class="col-md-6">
                      <label for="subject" class="form-label">Subject *</label>
                      <select
                        v-model="form.subject"
                        id="subject"
                        class="form-select"
                        :class="{ 'is-invalid': errors.subject }"
                        required
                        @blur="validateField('subject')"
                      >
                        <option value="">Choose a subject...</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Mental Health Support</option>
                        <option value="services">Service Information</option>
                        <option value="volunteer">Volunteer Opportunities</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                      </select>
                      <div v-if="errors.subject" class="invalid-feedback">{{ errors.subject }}</div>
                    </div>

                    <!-- Message -->
                    <div class="col-12">
                      <label for="message" class="form-label">Message *</label>
                      <textarea
                        v-model="form.message"
                        id="message"
                        class="form-control"
                        :class="{ 'is-invalid': errors.message }"
                        rows="5"
                        required
                        minlength="10"
                        maxlength="1000"
                        @blur="validateField('message')"
                      ></textarea>
                      <div v-if="errors.message" class="invalid-feedback">{{ errors.message }}</div>
                      <div class="form-text">{{ form.message.length }}/1000 characters</div>
                    </div>

                    <!-- Consent -->
                    <div class="col-12">
                      <div class="form-check">
                        <input
                          v-model="form.consent"
                          type="checkbox"
                          id="consent"
                          class="form-check-input"
                          :class="{ 'is-invalid': errors.consent }"
                          required
                          @change="validateField('consent')"
                        >
                        <label for="consent" class="form-check-label">
                          I consent to MindWell NFP collecting and using my information to respond to my inquiry. *
                        </label>
                        <div v-if="errors.consent" class="invalid-feedback d-block">{{ errors.consent }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between align-items-center mt-4">
                    <button
                      type="submit"
                      class="btn btn-primary btn-lg"
                      :disabled="loading || !isFormValid"
                    >
                      <div v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></div>
                      <Send class="me-2" :size="18" />
                      {{ loading ? 'Sending...' : 'Send Message' }}
                    </button>

                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="resetForm"
                      :disabled="loading"
                    >
                      Clear Form
                    </button>
                  </div>
                </form>

                <div v-if="submitStatus" class="alert mt-4" :class="submitStatus.type">
                  <div class="d-flex align-items-center">
                    <CheckCircle v-if="submitStatus.type === 'alert-success'" class="me-2" :size="20" />
                    <AlertCircle v-else class="me-2" :size="20" />
                    {{ submitStatus.message }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="col-lg-4">
            <div class="sticky-top" style="top: 2rem;">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Send, MapPin, Phone, Mail, Clock, 
  AlertTriangle, CheckCircle, AlertCircle 
} from 'lucide-vue-next'
import { contactService } from '@/services/firestore'

interface ContactForm {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  consent: boolean
}
interface ValidationErrors {
  [key: string]: string
}
interface SubmitStatus {
  type: 'alert-success' | 'alert-danger'
  message: string
}

const form = ref<ContactForm>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false
})

const errors = ref<ValidationErrors>({})
const loading = ref(false)
const submitStatus = ref<SubmitStatus | null>(null)

const isFormValid = computed(() => {
  return form.value.name.length >= 2 &&
         form.value.email.includes('@') &&
         form.value.subject &&
         form.value.message.length >= 10 &&
         form.value.consent &&
         Object.keys(errors.value).length === 0
})

const validateField = (fieldName: keyof ContactForm) => {
  errors.value = { ...errors.value }
  delete errors.value[fieldName]

  switch (fieldName) {
    case 'name':
      if (!form.value.name.trim()) {
        errors.value.name = 'Name is required'
      } else if (form.value.name.trim().length < 2) {
        errors.value.name = 'Name must be at least 2 characters'
      }
      break
    case 'email':
      if (!form.value.email.trim()) {
        errors.value.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = 'Please enter a valid email address'
      }
      break
    case 'phone':
      if (form.value.phone && !/^[\d\s\-\+\(\)]+$/.test(form.value.phone)) {
        errors.value.phone = 'Please enter a valid phone number'
      }
      break
    case 'subject':
      if (!form.value.subject) {
        errors.value.subject = 'Please select a subject'
      }
      break
    case 'message':
      if (!form.value.message.trim()) {
        errors.value.message = 'Message is required'
      } else if (form.value.message.trim().length < 10) {
        errors.value.message = 'Message must be at least 10 characters'
      } else if (form.value.message.length > 1000) {
        errors.value.message = 'Message cannot exceed 1000 characters'
      }
      break
    case 'consent':
      if (!form.value.consent) {
        errors.value.consent = 'You must provide consent to proceed'
      }
      break
  }
}

const validateForm = () => {
  Object.keys(form.value).forEach(key => {
    validateField(key as keyof ContactForm)
  })
}

const submitForm = async () => {
  validateForm()
  if (!isFormValid.value) {
    submitStatus.value = {
      type: 'alert-danger',
      message: 'Please correct the errors above before submitting.'
    }
    return
  }

  loading.value = true
  submitStatus.value = null

  try {
    const result = await contactService.create({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      subject: form.value.subject,
      message: form.value.message
    })
    
    if (result.success) {
      submitStatus.value = {
        type: 'alert-success',
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.'
      }
      resetForm()
    } else {
      submitStatus.value = {
        type: 'alert-danger',
        message: result.error || 'Failed to submit your message.'
      }
    }
    
  } catch (error) {
    console.error('Contact form error:', error)
    submitStatus.value = {
      type: 'alert-danger',
      message: 'Sorry, there was an error sending your message. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    consent: false
  }
  errors.value = {}
  submitStatus.value = null
}
</script>

<style scoped>
.contact-item .icon-wrapper {
  flex-shrink: 0;
}
.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
@media (max-width: 991.98px) {
  .sticky-top {
    position: relative !important;
    top: auto !important;
  }
}
</style>
