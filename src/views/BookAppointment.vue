<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-3">Book an Appointment</h1>
          <p class="lead text-muted">
            Schedule a consultation with one of our mental health professionals
          </p>
        </div>

        <div class="card shadow-sm border-0">
          <div class="card-body p-4">
            <form @submit.prevent="submitBooking" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="serviceType" class="form-label">Service Type *</label>
                  <select
                    v-model="form.serviceType"
                    id="serviceType"
                    class="form-select"
                    :class="{ 'is-invalid': errors.serviceType }"
                    required
                    @blur="validateField('serviceType')"
                  >
                    <option value="">Choose a service...</option>
                    <option value="counselling">Individual Counselling</option>
                    <option value="group">Group Therapy</option>
                    <option value="assessment">Mental Health Assessment</option>
                    <option value="crisis">Crisis Support</option>
                  </select>
                  <div v-if="errors.serviceType" class="invalid-feedback">{{ errors.serviceType }}</div>
                </div>

                <div class="col-md-6">
                  <label for="preferredDate" class="form-label">Preferred Date *</label>
                  <input
                    v-model="form.preferredDate"
                    type="date"
                    id="preferredDate"
                    class="form-control"
                    :class="{ 'is-invalid': errors.preferredDate }"
                    :min="minDate"
                    required
                    @blur="validateField('preferredDate')"
                  >
                  <div v-if="errors.preferredDate" class="invalid-feedback">{{ errors.preferredDate }}</div>
                </div>

                <div class="col-md-6">
                  <label for="preferredTime" class="form-label">Preferred Time *</label>
                  <select
                    v-model="form.preferredTime"
                    id="preferredTime"
                    class="form-select"
                    :class="{ 'is-invalid': errors.preferredTime }"
                    required
                    @blur="validateField('preferredTime')"
                  >
                    <option value="">Choose a time...</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                  <div v-if="errors.preferredTime" class="invalid-feedback">{{ errors.preferredTime }}</div>
                </div>

                <div class="col-md-6">
                  <label for="urgency" class="form-label">Urgency Level</label>
                  <select v-model="form.urgency" id="urgency" class="form-select">
                    <option value="routine">Routine (within 2 weeks)</option>
                    <option value="priority">Priority (within 1 week)</option>
                    <option value="urgent">Urgent (within 2-3 days)</option>
                  </select>
                </div>

                <div class="col-12">
                  <label for="reason" class="form-label">Reason for Appointment</label>
                  <textarea
                    v-model="form.reason"
                    id="reason"
                    class="form-control"
                    rows="4"
                    placeholder="Please describe what you'd like to discuss (optional)"
                    maxlength="500"
                  ></textarea>
                  <div class="form-text">{{ form.reason.length }}/500 characters</div>
                </div>

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
                      I consent to the collection and use of my personal information for appointment scheduling and mental health services. *
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
                  <Calendar class="me-2" :size="18" />
                  {{ loading ? 'Booking...' : 'Book Appointment' }}
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

        <!-- Emergency Notice -->
        <div class="alert alert-warning mt-4">
          <AlertTriangle class="me-2" :size="20" />
          <strong>Important:</strong> If you're experiencing a mental health crisis or having thoughts of self-harm, 
          please contact emergency services (000) or Lifeline (13 11 14) immediately. This booking system is for 
          non-emergency appointments only.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-vue-next'

interface BookingForm {
  serviceType: string
  preferredDate: string
  preferredTime: string
  urgency: string
  reason: string
  consent: boolean
}

interface ValidationErrors {
  [key: string]: string
}

interface SubmitStatus {
  type: 'alert-success' | 'alert-danger'
  message: string
}

const form = ref<BookingForm>({
  serviceType: '',
  preferredDate: '',
  preferredTime: '',
  urgency: 'routine',
  reason: '',
  consent: false
})

const errors = ref<ValidationErrors>({})
const loading = ref(false)
const submitStatus = ref<SubmitStatus | null>(null)

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return form.value.serviceType &&
         form.value.preferredDate &&
         form.value.preferredTime &&
         form.value.consent &&
         Object.keys(errors.value).length === 0
})

const validateField = (fieldName: keyof BookingForm) => {
  errors.value = { ...errors.value }
  delete errors.value[fieldName]

  switch (fieldName) {
    case 'serviceType':
      if (!form.value.serviceType) {
        errors.value.serviceType = 'Please select a service type'
      }
      break
      
    case 'preferredDate':
      if (!form.value.preferredDate) {
        errors.value.preferredDate = 'Please select a preferred date'
      } else {
        const selectedDate = new Date(form.value.preferredDate)
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        if (selectedDate < tomorrow) {
          errors.value.preferredDate = 'Please select a date from tomorrow onwards'
        }
      }
      break
      
    case 'preferredTime':
      if (!form.value.preferredTime) {
        errors.value.preferredTime = 'Please select a preferred time'
      }
      break
      
    case 'consent':
      if (!form.value.consent) {
        errors.value.consent = 'You must provide consent to book an appointment'
      }
      break
  }
}

const validateForm = () => {
  Object.keys(form.value).forEach(key => {
    validateField(key as keyof BookingForm)
  })
}

const submitBooking = async () => {
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
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock successful booking
    submitStatus.value = {
      type: 'alert-success',
      message: 'Your appointment request has been submitted successfully! We\'ll contact you within 24 hours to confirm your booking.'
    }
    
    // Store booking in localStorage
    const bookings = JSON.parse(localStorage.getItem('appointments') || '[]')
    bookings.push({
      ...form.value,
      timestamp: new Date().toISOString(),
      id: Date.now(),
      status: 'pending'
    })
    localStorage.setItem('appointments', JSON.stringify(bookings))
    
    resetForm()
    
  } catch (error) {
    submitStatus.value = {
      type: 'alert-danger',
      message: 'Sorry, there was an error submitting your booking. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    urgency: 'routine',
    reason: '',
    consent: false
  }
  errors.value = {}
  submitStatus.value = null
}
</script>

<style scoped>
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
</style>